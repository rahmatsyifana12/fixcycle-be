const Pool = require('pg').Pool;
const config = require('./configs/config');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = pool;