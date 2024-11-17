const Device = require('../dao/device_dao');
//条件查询单个
const findOne = async (params) => {
    let query = Device.query().withGraphFetched('hospital');
    if(params.id){
        query.where('id', params.id);
    }
    if(params.hospital_id){
        query.where('hospital_id', params.hospital_id);
    }
    if(params.device_imei_code){
        query.where('device_imei_code', params.device_imei_code);
    }
    if(params.device_reg_code){
        query.where('device_reg_code', params.device_reg_code);
    }
    return await query;
}
const getCount = async (params) => {
    let query = Device.query();
    if(params.hospital_id){
        query.where('hospital_id', params.hospital_id);
    }
    if(params.device_imei_code){
        query.where('device_imei_code', params.device_imei_code);
    }
    let count = await query.count('id as count')
    return count[0]['count'];
}
const findAll = async (params) => {
    let query = Device.query().withGraphFetched('hospital');
    if(params.hospital_id){
        query.where('hospital_id', params.hospital_id);
    }
    if(params.device_imei_code){
        query.where('device_imei_code', params.device_imei_code);
    }
    if(params.page && params.limit){
        query.limit(params.limit).offset((params.page - 1) * params.limit);
    }
    return await query.orderBy('create_time', 'desc');
}

const add = async (params) => {
    let query = Device.query();
    return await query.insert({...params});
}

const update = async (params) => {
    let query = Device.query();
    return await query.where('id',params.id).update(params);
}

const updateState = async (id,state) => {
    return Device.query().findById(id).patch({is_update:state});
}

const remove = async (params) => {
    let query = Device.query();
    return await query.deleteById(params.id);
}
module.exports = {findOne,findAll,getCount,add,update,updateState,remove}