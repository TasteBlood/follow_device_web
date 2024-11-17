const {Model} = require('../model/db_utils');

class User extends Model {
    static get tableName() {
        return 't_user';
    }
    static get jsonSchema() {
        return {
            type: 'object',
            required: ['username', 'real_name'],
            properties: {
                id:{type: 'integer'},
                username:{type: 'string'},
                password:{type: 'string'},
                real_name:{type: 'string'},
                mobile:{type: 'string'},
                // 0=可用 -1=禁用
                state:{type:'integer', default:0},
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

module.exports = User;