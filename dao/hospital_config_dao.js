const {Model} = require('../model/db_utils');

class HospitalConfig extends Model {
    static get tableName() {
        return 't_hospital_config';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                hospital_id:{type: 'integer'},
                api_url:{type: 'string'},
                certificate_id:{type: 'string'},
                public_key:{type: 'string'},
                private_key:{type: 'string'},
                ywjgdm:{type: 'string'},
                xtmc:{type: 'string'},
                jgid:{type: 'string'},
                xzid:{type: 'string'},
                create_time:{type: 'string'},
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

module.exports = HospitalConfig;