const mysql2 = require('mysql2/promise')

const pool = mysql2.createPool({
    host:'192.168.31.112',
    port:'3306',
    user:'root',
    password:'Hello1234@',
    database:'follow_device_db'
})

pool.getConnection().then(res=>{
    console.log('connect a database!')
    res.release()
}).catch(err=>{
console.log('error',err)
});

module.exports = pool;
