let express = require('express');
let router = express.Router();
const isAuth = require('./authentication');
const {locals} = require("express/lib/application");
const {application} = require("express");
const {json_fail, json_success} = require("../model/output");
const {login} = require("../model/user_service");

/* GET login page. */
router.get('/', function (req, res) {
  res.render('login');
})
router.get('/logout',function (req,res,next){
  req.session.user = null
  res.locals.user = null
  res.redirect('/')
});
router.get('/home', isAuth,function (req,res,next) {
  res.render('home', {title:'首页'})
})
/* login success to main,otherwise to login*/
router.post('/api/login',async function (req,res,next){
  let username = req.body.username
  let password = req.body.password
  let result = await login(username,password)
  if(result && result.length>0){
    if(result[0].state===-1){
      return res.send(json_fail('该用户已被禁用！'));
    }
    req.session.user = result[0]
    res.send(json_success())
  }else{
    res.send(json_fail('用户名或密码错误'))
  }
})
module.exports = router;
