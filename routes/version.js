let express = require('express');
let isAuth = require('./authentication')
const {findAll, getCount, add, findOne, update, remove} = require("../model/version_service");
const {json_success, json_fail} = require("../model/output");
const fs = require('fs');
const {UPLOAD_PATH} = require("../model/config");
let router = express.Router();

/* GET users listing. */
router.get('/',isAuth,function(req, res, next) {
    res.render('version/list', {title:'版本管理'});
});
//查询全部列表
router.get('/api/findAll',isAuth,async function(req,res){
    let query = req.query;
    let data = await findAll(query)
    let count = await getCount(query)
    res.send(json_success({data,count}))
})
//根据单个记录
router.get('/api/findOne',isAuth,async function(req,res){
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
    delete params.file
    params.hospital_id = parseInt(params.hospital_id)
    let result = await add(params)
    if(result){
        res.send(json_success())
    }else{
        res.send(json_fail('添加失败!'))
    }
})
//编辑
router.post('/api/edit',isAuth,async function(req,res){
    let params = req.body
    delete params.file
    params.hospital_id = parseInt(params.hospital_id)
    params.id = parseInt(params.id)
    let result = await update(req.body)
    if(result){
        res.send(json_success())
    }else{
        res.send(json_fail('编辑失败!'))
    }
})
//删除
router.get('/api/delete',isAuth,async function(req,res){
    //先根据id查询，删除上传过的文件
    let result = await findOne(req.query)
    if(result && result.length > 0){
        let path = result[0].url
        fs.unlinkSync(UPLOAD_PATH + path)
    }
    result = await remove(req.query)
    if(result){
        //删除成功，再删除本地存储的文件

        res.send(json_success())
    }else{
        res.send(json_fail('删除失败!'))
    }
})
module.exports = router;
