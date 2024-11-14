let express = require('express');
let router = express.Router();
const isAuth = require('./authentication');

/* GET login page. */
router.get('/', function(req, res, next) {
  res.render('login');
});
router.get('/logout',function (req,res,next){
  req.session.user = null
  res.redirect('/')
});
router.get('/home', function (req,res,next) {
  res.render('home', {title:'首页'})
})
/* login success to main,otherwise to login*/
router.post('/login',function (req,res,next){
  let username = req.body.username
  let password = req.body.password
  console.log(req.body)
  if('xuxiwu' === username && '123456' === password){
    req.session.user = {'name':username,'password':password}
    res.redirect('/home')
  }else{
    res.redirect('/?error=用户名或密码错误')
  }
})
module.exports = router;
