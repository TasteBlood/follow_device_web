let express = require('express');
let isAuth = require('./authentication')
const {findAll, getCount, add, findOne, update, remove, updateState} = require("../model/device_service");
const {json_success, json_fail} = require("../model/output");
const uuid = require('../model/reg_code_utils');
let router = express.Router();

/* GET users listing. */
router.get('/',isAuth,function(req, res, next) {
    res.render('devices/list', {title:'设备管理'});
});
//查询全部列表
router.get('/api/findAll',isAuth,async function(req,res){
    let query = req.query;
    let data = await findAll(query)
    let count = await getCount(query)
    res.send(json_success({data,count}))
})
//根据单个设备信息
router.get('/api/findOne',async function(req,res){
    let result = await findOne(req.query)
    if(result && result.length > 0){
        res.send(json_success({data:result[0]}))
    }else{
        res.send(json_fail('暂未找到该记录!'))
    }
})
//添加
router.post('/api/add',isAuth,async function(req,res){
    let params = req.body
    delete params.id
    //现根据imei去查，如果有重复的就不能添加
    let exists = await findOne(params)
    if(exists && exists.length > 0){
        return res.send(json_fail('该设备已存在！'))
    }
    params.hospital_id = parseInt(params.hospital_id)
    params.is_update = parseInt(params.is_update)
    let result = await add(params)
    if(result){
        res.send(json_success())
    }else{
        res.send(json_fail('添加失败!'))
    }
})
//编辑
router.post('/api/edit',isAuth,async function(req,res){
    let result = await update(req.body)
    if(result){
        res.send(json_success())
    }else{
        res.send(json_fail('编辑失败!'))
    }
})
router.post('/api/updateState',isAuth,async function(req,res){
    let id = parseInt(req.body.id)
    let state = parseInt(req.body.state)
    let result = await updateState(id, state)
    if(result){
        res.send(json_success())
    }else{
        res.send(json_fail('修改失败'))
    }
})
//删除
router.get('/api/remove',isAuth,async function(req,res){
    let result = await remove(req.query)
    if(result){
        res.send(json_success())
    }else{
        res.send(json_fail('删除失败!'))
    }
})
/* 内部生成注册码 */
router.post('/api/regCode',isAuth,async function (req, res) {
    let imei = req.body.device_imei_code
    if(!imei){
        return res.send(json_fail('设备序列号为空'))
    }
    let code = await uuid(imei)
    res.send(json_success({code}))
})
module.exports = router;
