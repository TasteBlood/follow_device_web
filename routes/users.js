let express = require('express');
const {findAll, getCount, findOne, add, update, updateState, remove} = require("../model/user_service");
const {json_success, json_fail} = require("../model/output");
const isAuth = require("./authentication");
let router = express.Router();

/* GET users listing. */
router.get('/',isAuth,function(req, res, next) {
  res.render('user/list',{title:'用户管理'});
});
router.get('/api/findAll',isAuth, async function(req, res, next) {
  let data = await findAll(req.query);
  let count = await getCount(req.query)
  res.send(json_success({data,count}))
})
//根据单个设备信息
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
  delete params.password1
  //现根据imei去查，如果有重复的就不能添加
  let exists = await findOne(params)
  if(exists && exists.length > 0){
    return res.send(json_fail('该用户名已存在！'))
  }
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
  delete params.password1
  params.id = parseInt(req.body.id)
  //现根据用户id去查，如果有重复的就不能添加
  let exists = await findOne({id:params.id})
  if(exists && exists.length > 0){
    //先判断新用户名和原用户名是否一样
    if(params.username !== exists[0].username){
      //不一样的话，就需要做用户名重复判断
      exists = await findOne({username:params.username})
      if(exists && exists.length > 0){
        return res.send(json_fail('用户名已存在！'))
      }
    }
  }else{
    return res.send(json_fail('该用户不存在！'))
  }
  let result = await update(params)
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
router.get('/api/delete',isAuth,async function(req,res){
  let result = await remove(req.query)
  if(result){
    res.send(json_success())
  }else{
    res.send(json_fail('删除失败!'))
  }
})

module.exports = router;
