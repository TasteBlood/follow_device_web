
const pool = require('./db_utils');

const getCount = function (key,province,city,county){

}

const findAll =  async (page,size,key,province,city,county)=>{
    const [results] = await pool.execute('select * from t_hospital');
    return results;

}
const findById = function (id){

}
const add = function (){

}
const edit = function (){

}
const delById = function (id){

}

module.exports = {getCount,findAll,findById,add,edit,delById}
