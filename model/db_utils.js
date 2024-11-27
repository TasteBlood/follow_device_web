const Knex = require('knex');
const {Model} = require('objection');

//配置knex
const knex = Knex({
    client: 'mysql2',
    // connection: {
    //     host: 'localhost',
    //     user: 'root',
    //     password: 'Hello1234@',
    //     database: 'follow_device_db',
    // },
    // connection: {
    //     host: '192.168.31.112',
    //     user: 'root',
    //     password: 'Hello1234@',
    //     database: 'follow_device_db',
    // },
    debug:false,
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'wan0701...',
        database: 'follow_device_db',
        timezone:'Z',
    }
});

Model.knex(knex);

module.exports = {knex,Model};
