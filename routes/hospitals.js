let express = require('express');
let isAuth = require('./authentication')
const {findAll, getCount, add} = require("../model/hospital_service");
const {json_success, json_fail} = require("../model/output");

let router = express.Router();

/* GET users listing. */
router.get('/',async function(req, res, next) {
    let all = await findAll();
    res.render('hospital/list', {title:'医院管理'});
});
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
//添加数据
router.post('/add',async function(req, res, next) {
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

module.exports = router;
