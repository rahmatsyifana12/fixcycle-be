const bcrypt = require('bcrypt');
const config = require('../configs/config');
const pool = require('../db');

async function addNewUser(req, res) {
    const { email, password, fullName, phoneNumber, address } = req.body;

    try {
        const existUser = await pool.query(
            'SELECT * FROM users WHERE email=$1;',
            [email]
        );

        if (existUser.rowCount > 0) {
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
            `INSERT INTO users (email, password, full_name, phone_number, address, loggedin)
            VALUES ($1, $2, $3, $4, $5, FALSE);`,
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

async function loginUser(req, res) {
    const { email, password } = req.body;
    let users;

    try {
        users = await pool.query(
            'SELECT * FROM users WHERE email=$1;',
            [email]
        );

        if (!users.rowCount) {
            return res.status(400).json({
                status: 'fail',
                message: 'Account doesn\'t exist'
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }

    const user = users.rows[0];

    try {
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(400).json({
                status: 'fail',
                message: 'Object or value is invalid'
            });
        }

        await pool.query(
            'UPDATE users SET loggedin=TRUE WHERE email=$1;',
            [email]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Successfully login'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

module.exports = {
    addNewUser,
    loginUser
};