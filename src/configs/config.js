const dotenv = require('dotenv');

dotenv.config();
const { env } = process;

const config = {
    db: {
        host: env.DB_HOST,
        database: env.DB_DATABASE,
        username: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        port: parseInt(env.DB_PORT)
    },
    hashRounds: 10,
    port: env.LOCAL_PORT,
    jwt: {
        accessSecret: env.ACCESS_TOKEN_SECRET,
        accessExpire: '1d'
    },
    serviceTypes: {
        "FAST_TRACK": 1,
        "LIGHT_SERVICE": 2,
        "HEAVY_REPAIR": 3,
        "CLAIM_REPAIR": 4
    }
};

module.exports = config;