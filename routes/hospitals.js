let express = require('express');
let isAuth = require('./authentication')
const {findAll, getCount, add, deleteById, findOne, edit} = require("../model/hospital_service");
const DeviceService  = require('../model/device_service');
const Config = require('../model/hos_config_service');
const {json_success, json_fail} = require("../model/output");


let router = express.Router();

/* GET users listing. */
router.get('/', isAuth, function(req, res, next) {
    res.render('hospital/list', {title:'医院管理'});
});
//查询列表数据
router.get('/api/findAll',isAuth,async function(req, res, next) {
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    let key = req.query.keywords || '';
    let province = req.query.province || '';
    let city = req.query.city || '';
    let county = req.query.county || '';
    let data = await findAll(page, limit, key, province, city, county);
    let count = await getCount(key,province,city,county);
    res.send(json_success({data,count}))
})
//根据id查询
router.get('/api/findOne',isAuth,async function(req, res, next) {
    let id = req.query.id;
    let result = await findOne(id)
    if(result && result.length > 0) {
        res.send(json_success({data:result[0]}))
    }else{
        res.send(json_fail({}))
    }
})
//添加数据
router.post('/api/add',isAuth,async function(req, res, next) {
    let name = req.body.name;
    let link = req.body.link;
    let mobile = req.body.mobile;
    let city = req.body.city;
    let county = req.body.county;
    let province = req.body.province;
    let address = req.body.address || '';
    let result = await add(name, link, mobile, province, city, county, address);
    if(result){
        res.send(json_success())
    }else{
        res.send(json_fail('添加失败'))
    }
});
//编辑数据
router.post('/api/edit',isAuth,async function(req, res, next) {
    let id = req.body.id;
    let name = req.body.name;
    let link = req.body.link;
    let mobile = req.body.mobile;
    let city = req.body.city;
    let county = req.body.county;
    let province = req.body.province;
    let address = req.body.address || '';
    let result = await edit(id, name, link, mobile, province, city, county, address);
    if(result){
        res.send(json_success())
    }else{
        res.send(json_fail('编辑失败'))
    }
});
//删除数据
router.post('/api/delete',isAuth,async function(req, res, next) {
    let id = req.body.id;
    let result = await deleteById(id)
    if(result){
        res.send(json_success())
    }else{
        res.send(json_fail('删除失败'))
    }
})
//查询公卫信息
router.get('/api/getConfig',isAuth,async function(req, res, next) {
    let hospital_id = parseInt(req.query.hospital_id);
    if(!hospital_id){
        return res.send(json_fail('医院id为空！'))
    }
    let result = await Config.findOne({hospital_id})
    if(result && result.length > 0) {
        return res.send(json_success({data:result[0]}))
    }else{
        return res.send(json_success({data:{}}))
    }
})
//保存公卫信息
router.post('/api/saveConfig',isAuth,async function(req, res, next) {
    let params = req.body;
    params.hospital_id = parseInt(params.hospital_id);
    let result = await Config.findOne({hospital_id:params.hospital_id})
    if(result && result.length > 0) {
        //更新操作
        result = await Config.update(params)
    }else{
        //插入操作
        result = await Config.add(params)
    }
    if(result){
        res.send(json_success())
    }else{
        res.send(json_fail('操作失败'))
    }
})
//查询首页统计数据
router.get('/api/statistics',isAuth,async function(req, res, next) {
    //按医院查询设备的数量，并且返回
    let result = await findAll(1,100,'','','','')
    for(let i=0;i<result.length;i++){
        result[i].deviceCount = await DeviceService.getCount({hospital_id: result[i].id})
    }
    res.send(json_success({data:result}))
})
module.exports = router;
