const Knex = require('knex');
const {Model} = require('objection');

//配置knex
const knex = Knex({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'Hello1234@',
        database: 'follow_device_db',
    }
});

Model.knex(knex);

module.exports = {knex,Model};
