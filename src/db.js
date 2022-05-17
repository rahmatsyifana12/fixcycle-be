const Pool = require('pg').Pool;
const config = require('./configs/config');


const pool = new Pool({
    user: config.db.username,
    password: config.db.password,
    host: config.db.host,
    port: config.port,
    database: config.db.database
});

module.exports = pool;