let express = require('express');
const {json_success, json_fail} = require("../model/output");
const {findOne} = require("../model/device_service");
const Version = require("../model/version_service");
const Config = require("../model/hos_config_service");
let router = express.Router();

/* 设备获取注册码 */
router.get('/getCode',async function (req, res) {
  let device_imei_code = req.query.device_imei_code;
  if(!device_imei_code){
    return res.send(json_fail('设备序列号不能为空'));
  }
  // 从数据库查询设备注册码
  let result = await findOne({device_imei_code})
  if(!result || result.length <= 0){
    return res.send(json_fail('该设备还未登记！'))
  }else{
    //需要将原始code base64 传输
    let code = result[0].device_reg_code
    return res.send(json_success({device_reg_code:btoa(code)}))
  }
})
//设备运行检查
router.get('/launch',async function (req, res) {
  let device_imei_code = req.query.device_imei_code;
  let device_reg_code = req.query.device_reg_code;
  if(!device_imei_code || !device_reg_code){
    res.send(json_fail('缺少关键信息！'))
  }else{
    //因为传输的是base64串，所以还需要进行base64解码
    let result = await findOne({device_imei_code,device_reg_code:atob(device_reg_code)})
    if(!result || result.length <= 0){
      res.send(json_fail('序列号或注册码错误！'))
    }else{
      let data = result[0]
      delete data['id']
      delete data['device_reg_code']
      delete data['device_imei_code']
      //在这里根据医院ID查询公卫平台注册信息
      let config = await Config.findOne({hospital_id:data.hospital_id})
      if(config && config.length > 0){
        //有数据，就插入
        config = config[0]
        delete config['hospital_id']
      }else{
        //无数据插入空
        config = {}
      }
      data['config'] = config;
      res.send(json_success({data:data}))
    }
  }
})
/* 版本更新的接口 */
router.get('/update', async function (req, res) {
  let hospital_id = req.query.hospital_id;
  let device_imei_code = req.query.device_imei_code;
  if(!hospital_id){
    return res.send(json_fail('医院id为空'))
  }
  if(!device_imei_code){
    return res.send(json_fail('设备序列号为空'))
  }
  //再查询医院是否支持更新
  let result = await findOne({hospital_id:parseInt(hospital_id),device_imei_code:device_imei_code})
  if(!result || result.length <= 0){
    return res.send(json_fail('无设备信息'))
  }else{
    if(result[0].is_update===-1){
      return res.send(json_fail('该设备不支持更新'))
    }
  }
  result = await Version.findOne({hospital_id:parseInt(hospital_id)})
  if(result && result.length > 0){
    res.send(json_success({version:result[0]}))
  }else{
    res.send(json_success({version:{}}))
  }
})

module.exports = router;
