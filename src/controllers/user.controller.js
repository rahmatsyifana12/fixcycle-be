const bcrypt = require('bcrypt');
const config = require('../configs/config');
const pool = require('../db');

async function addNewUser (req, res) {
    const { email, password, fullName, phoneNumber, address } = req.body;

    try {
        const existUser = await pool.query(
            'SELECT * FROM users WHERE email=$1;',
            [email]
        );

        if (existUser.countRows > 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'This account is already exist'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }

    const hashedPassword = bcrypt.hashSync(
        password,
        config.hashRounds
    );

    try {
        await pool.query(
            `INSERT INTO users (email, password, full_name, phone_number, address)
            VALUES ($1, $2, $3, $4, $5);`,
            [email, hashedPassword, fullName, phoneNumber, address]
        );

        return res.status(201).json({
            status: 'success',
            message: 'Successfully registered a new account'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

module.exports = {
    addNewUser
};