const pool = require('./db');

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
                type VARCHAR(255) NOT NULL,
                cylinder_capacity DECIMAL(19, 2) NOT NULL,
                production_year DATE NOT NULL,
                color VARCHAR(32) NOT NULL,
                fuel_type VARCHAR(32) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(id)
            );`
        );

        await pool.query(
            `CREATE TABLE IF NOT EXISTS services (
                id SERIAL NOT NULL PRIMARY KEY,
                user_id INT NOT NULL,
                motorcycle_id INT NOT NULL,
                service_type SMALLINT NOT NULL,
                service_request VARCHAR(1023),
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
                VALUES ('johndoe@example.com', 'johndoe123', 'John Doe', '08123456789', 'Cimahi, Jawa Barat', FALSE),
                ('maryjane@example.com', 'maryjane123', 'Mary Jane', '08123456789', 'Surabaya, Jawa Timur', FALSE);
            `
        );

        await pool.query(
            `
                INSERT INTO motorcycles (user_id, lisence_plate, owner_name, brand, type, cylinder_capacity,
                production_year, color, fuel_type) VALUES
                (1, 'A 123 BC', 'John Doe', 'Yamaha', 'Sport', '255', '2019-05-23', 'Blue', 'Pertamax'),
                (1, 'D 456 DD', 'Rahmat Syifana', 'Honda', 'Trail', '155', '2015-01-22', 'Red', 'Pertalite'),
                (2, 'E 23 DXS', 'Richard Stevan', 'Honda', 'Sport', '155', '2016-11-12', 'Green', 'Pertamax Turbo');
            `
        );

        await pool.query(
            `
                INSERT INTO services (user_id, motorcycle_id, service_type, service_request, service_time, status, created_at)
                VALUES (1, 1, 1, 'Fix flat tires', '2022-07-22 12:12:00', 1, $1),
                (2, 1, 2, 'Perbaiki handle kopling', '2022-06-30 14:12:00', 1, $2);
            `,
            [dateNow, dateNow]
        );
    } catch (error) {
        console.log(error.message);
    }
}

runSeeder();