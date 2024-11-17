const HospitalConfig = require('../dao/hospital_config_dao');

//条件查询单个
const findOne = async (params) => {
    let query = HospitalConfig.query()
    if(params.id){
        query.where('id', params.id);
    }
    if(params.hospital_id){
        query.where('hospital_id', params.hospital_id);
    }
    return await query;
}

const add = async (params) => {
    let query = HospitalConfig.query();
    return await query.insert({...params});
}

const update = async (params) => {
    let query = HospitalConfig.query();
    return await query.where('hospital_id',params.hospital_id).update(params);
}

module.exports = {findOne,add,update}