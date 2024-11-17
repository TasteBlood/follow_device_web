const {Model} = require('../model/db_utils');
const Hospital = require("./hospital_dao");

class Version extends Model {
    static get tableName() {
        return 't_version';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id:{type: 'integer'},
                version:{type: 'string'},
                code:{type: 'string'},
                hospital_id:{type: 'integer'},
                content:{type: 'string'},
                url:{type: 'string'},
                size:{type: 'string'},
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
                    from: 't_version.hospital_id',
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

module.exports = Version;