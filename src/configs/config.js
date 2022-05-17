const dotenv = require('dotenv');

dotenv.config();
const { env } = process;

const config = {
    db: {
        host: env.DB_HOST,
        database: env.DB_DATABASE,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD
    },
    hashRounds: 10,
    port: 5000
};

module.exports = config;