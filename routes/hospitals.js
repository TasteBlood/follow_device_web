let express = require('express');
let isAuth = require('./authentication')
const {findAll, getCount, add, deleteById, findOne, edit} = require("../model/hospital_service");
const {json_success, json_fail} = require("../model/output");


let router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('hospital/list', {title:'医院管理'});
});
//查询列表数据
router.get('/api/findAll',async function(req, res, next) {
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
router.get('/api/findOne',async function(req, res, next) {
    let id = req.query.id;
    let result = await findOne(id)
    if(result && result.length > 0) {
        res.send(json_success({data:result[0]}))
    }else{
        res.send(json_fail({}))
    }
})
//添加数据
router.post('/api/add',async function(req, res, next) {
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
router.post('/api/edit',async function(req, res, next) {
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
router.post('/api/delete',async function(req, res, next) {
    let id = req.body.id;
    let result = await deleteById(id)
    if(result){
        res.send(json_success())
    }else{
        res.send(json_fail('删除失败'))
    }
})

module.exports = router;
