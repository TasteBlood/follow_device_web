const User = require('../dao/user_dao');
const login = async (username,password)=>{
    let query = User.query();
    query.where({username:username,password:password})
    return await query;
}
//条件查询单个
const findOne = async (params) => {
    let query = User.query();
    if(params.id){
        query.orWhere('id', params.id);
    }
    if(params.username){
        query.orWhere('username', params.username);
    }
    return await query;
}
const getCount = async (params) => {
    let query = User.query();
    if(params.username){
        query.orWhere('username', 'like',`%${params.username}%`)
            .orWhere('real_name', 'like',`%${params.username}%`);
    }
    let count = await query.count('id as count')
    return count[0]['count'];
}
const findAll = async (params) => {
    let query = User.query();
    if(params.username){
        query.orWhere('username', 'like',`%${params.username}%`)
            .orWhere('real_name', 'like',`%${params.username}%`);
    }
    if(params.page && params.limit){
        query.limit(params.limit).offset((params.page - 1) * params.limit);
    }
    return await query.orderBy('state', 'desc').orderBy('create_time', 'desc');
}

const add = async (params) => {
    let query = User.query();
    return await query.insert({...params});
}

const update = async (params) => {
    let query = User.query();
    return await query.where('id',params.id).update(params);
}

const updateState = async (id,state) => {
    return User.query().findById(id).patch({state:state});
}

const remove = async (params) => {
    let query = User.query();
    return await query.deleteById(params.id);
}
module.exports = {findOne,findAll,getCount,add,update,updateState,remove,login}