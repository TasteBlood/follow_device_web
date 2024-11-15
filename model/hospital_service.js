const Hospital = require('../dao/hospital_dao');
const getCount = async (name,province,city,county) => {
    const query = Hospital.query();
    if(name){
        query.where('name', 'like' ,`%${name}%`)
    }
    if(province){
        query.where('province', 'like' ,`%${province}%`)
    }
    if(city){
        query.where('city', 'like' ,`%${city}%`)
    }
    if(county){
        query.where('county', 'like' ,`%${county}%`)
    }
    const data = await query.count('id as count');
    return data[0]['count'];
}
const findAll = async (page,limit,name,province,city,county) => {
    const query = Hospital.query()
    if(name){
        query.where('name', 'like' ,`%${name}%`)
    }
    if(province){
        query.where('province', 'like' ,`%${province}%`)
    }
    if(city){
        query.where('city', 'like' ,`%${city}%`)
    }
    if(county){
        query.where('county', 'like' ,`%${county}%`)
    }
    return await query.orderBy('create_time','desc').limit(limit).offset((page-1)*limit);
}
const findOne = async (id) => {
    return await Hospital.query().where('id', '=', id)
}
const add = async (name,link,mobile,province,city,county,address) => {
    return await Hospital.query().insert({
        name,
        link,
        mobile,
        province,
        city,
        county,
        address
    });
}

const edit = async (id,name,link,mobile,province,city,county,address) => {
    return await Hospital.query().where('id','=',id).update({
        name,
        link,
        mobile,
        province,
        city,
        county,
        address
    });
}

const deleteById = async (id) => {
    return Hospital.query().deleteById(id);
}
module.exports = {findAll,getCount,add,deleteById,findOne,edit}