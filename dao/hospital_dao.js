const {Model} = require('../model/db_utils');

class Hospital extends Model {
    static get tableName() {
        return 't_hospital';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['name'],
            properties: {
                id:{type: 'integer'},
                name:{type: 'string'},
                link:{type: 'string'},
                mobile:{type: 'string'},
                city:{type: 'string'},
                county:{type: 'string'},
                province:{type: 'string'},
                create_time:{type: 'string'},
            }
        }
    }
    async $beforeInsert(){
        this.create_time = new Date().toLocaleString('zh-CN');
    }

}

module.exports = Hospital;