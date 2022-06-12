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
                name VARCHAR(255) NOT NULL,
                phone_number VARCHAR(255),
                address VARCHAR(255),
                is_admin BOOLEAN NOT NULL,
                access_token VARCHAR(255)
            );`
        );

        await pool.query(
            `CREATE TABLE IF NOT EXISTS motorcycles (
                id SERIAL NOT NULL PRIMARY KEY,
                user_id INT NOT NULL,
                lisence_plate VARCHAR(32) NOT NULL,
                name VARCHAR(255) NOT NULL,
                brand VARCHAR(255) NOT NULL,
                type VARCHAR(255) NOT NULL,
                cylinder_capacity DECIMAL(19, 2) NOT NULL,
                production_year DATE NOT NULL,
                color VARCHAR(32) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );`
        );

        await pool.query(
            `CREATE TABLE IF NOT EXISTS services (
                id SERIAL NOT NULL PRIMARY KEY,
                user_id INT NOT NULL,
                motorcycle_id INT NOT NULL,
                type SMALLINT NOT NULL,
                request VARCHAR(1023),
                service_time TIMESTAMP NOT NULL,
                status SMALLINT NOT NULL,
                created_at TIMESTAMP NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id),
                FOREIGN KEY (motorcycle_id) REFERENCES motorcycles(id)
            );`
        );
    } catch (error) {
        console.log(error);
    }
    console.log(`Server is running at http://localhost:${port}`);
});