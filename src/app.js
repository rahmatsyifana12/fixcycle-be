const express = require('express');
const pool = require('./db');
const routes = require('./routes');
const config = require('./configs/config');

const app = express();
const port = config.port;

app.use(express.json());
app.use(routes);

app.listen(port, async () => {
    try {
        await pool.query(
            `CREATE TABLE IF NOT EXISTS users (
                id SERIAL NOT NULL PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                password VARCHAR(255) NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                phone_number VARCHAR(255) NOT NULL,
                address VARCHAR(255) NOT NULL,
                access_token VARCHAR(255)
            );`
        );
    } catch (error) {
        console.log(error);
    }
    console.log(`Server is running at http://localhost:${port}`);
});