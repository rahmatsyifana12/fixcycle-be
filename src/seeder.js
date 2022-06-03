const moment = require('moment');
const pool = require('./db');
const bcrypt = require('bcrypt');
const config = require('./configs/config');
const { MotorcycleType } = require('./controllers/motorcycle.controller');

function getHashedPassword(rawPassword) {
    const hashedPassword = bcrypt.hashSync(
        rawPassword,
        config.hashRounds
    );

    return hashedPassword;
}

async function runSeeder() {
    const dateNow = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');
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
                owner_name VARCHAR(255) NOT NULL,
                brand VARCHAR(255) NOT NULL,
                type SMALLINT NOT NULL,
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

        await pool.query(
            `
                INSERT INTO users (email, password, name, phone_number, address, is_admin)
                VALUES ('johndoe@example.com', $1, 'John Doe', '08123456789', 'Cimahi, Jawa Barat', FALSE),
                ('maryjane@example.com', $2, 'Mary Jane', '08123456789', 'Surabaya, Jawa Timur', FALSE),
                ('admin1@example.com', $3, 'Admin 1', '0812000001', 'Jakarta Pusat, DKI Jakarta', TRUE)
            `,
            [getHashedPassword('johndoe123'), getHashedPassword('maryjane123'), getHashedPassword('admin123')]
        );

        await pool.query(
            `
                INSERT INTO motorcycles (user_id, lisence_plate, owner_name, brand, type, cylinder_capacity,
                production_year, color) VALUES
                (1, 'A 123 BC', 'John Doe', 'Yamaha', $1, '255', '2019-05-23', 'Blue'),
                (1, 'D 456 DD', 'Rahmat Syifana', 'Honda', $2, '155', '2015-01-22', 'Red'),
                (2, 'E 23 DXS', 'Richard Stevan', 'Honda', $3, '155', '2016-11-12', 'Green');
            `,
            [MotorcycleType.SPORT, MotorcycleType.CUB, MotorcycleType.SPORT]
        );

        await pool.query(
            `
                INSERT INTO services (user_id, motorcycle_id, type, request, service_time, status, created_at)
                VALUES (1, 1, 1, 'Fix flat tires', '2022-07-22 12:12:00', 1, $1),
                (2, 1, 2, 'Perbaiki handle kopling', '2022-06-30 14:12:00', 1, $2);
            `,
            [dateNow, dateNow]
        );

        console.log('Seeding success . . .');
    } catch (error) {
        console.log(error.message);
    }
}

runSeeder();