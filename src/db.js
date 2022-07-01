const Pool = require('pg').Pool;
const config = require('./configs/config');

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: {rejectUnauthorized: false} });

module.exports = pool;