const Version = require('../dao/versin_dao');
//条件查询单个
const findOne = async (params) => {
    let query = Version.query().withGraphFetched('hospital');
    if(params.id){
        query.where('id', params.id);
    }
    if(params.hospital_id){
        query.where('hospital_id', params.hospital_id);
    }
    return await query.orderBy('version', 'DESC').limit(1);
}
const getCount = async (params) => {
    let query = Version.query();
    if(params.hospital_id){
        query.where('hospital_id', params.hospital_id);
    }
    let count = await query.count('id as count')
    return count[0]['count'];
}
const findAll = async (params) => {
    let query = Version.query().withGraphFetched('hospital');
    if(params.hospital_id){
        query.where('hospital_id', params.hospital_id);
    }
    return await query.orderBy('create_time', 'desc');
}

const add = async (params) => {
    let query = Version.query();
    return await query.insert({...params});
}

const update = async (params) => {
    let query = Version.query();
    return await query.where('id',params.id).update(params);
}

const remove = async (params) => {
    let query = Version.query();
    return await query.deleteById(params.id);
}
module.exports = {findOne,findAll,getCount,add,update,remove}