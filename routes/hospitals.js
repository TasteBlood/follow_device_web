let express = require('express');
let isAuth = require('./authentication')
const {findAll} = require("../model/hospital");

let router = express.Router();

/* GET users listing. */
router.get('/', isAuth,async function(req, res, next) {
    let all = await findAll();
    res.render('hospital/list', {title:'医院管理',data:all});
});

module.exports = router;
