const {Model} = require('../model/db_utils');
const Hospital = require('./hospital_dao');

class Device extends Model {
    static get tableName() {
        return 't_device';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['hospital_id','device_imei_code','device_reg_code'],
            properties: {
                id:{type: 'integer'},
                hospital_id:{type: 'integer'},
                device_imei_code:{type: 'string'},
                device_reg_code:{type: 'string'},
                //1=支持 -1=不支持
                is_update:{type: 'integer', default:1},
                create_time:{type: 'string'},
            }
        }
    }

    static get relationMappings() {
        return {
            hospital: {
                relation: Model.BelongsToOneRelation,
                modelClass:Hospital,
                join:{
                    from: 't_device.hospital_id',
                    to: 't_hospital.id',
                },
                modify(query){
                    query.select('id','name')
                }
            }
        }
    }

    async $beforeInsert(){
        this.create_time = new Date();
    }

    $formatJson(json) {
        json = super.$formatJson(json);
        if(json.create_time){
            json.create_time = new Date(json.create_time).toLocaleString();
        }
        return json;
    }

}

module.exports = Device;