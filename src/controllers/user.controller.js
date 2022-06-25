const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('../configs/config');
const pool = require('../db');

async function addNewUser(req, res) {
    const { email, password, name, phoneNumber, address } = req.body;

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
            `INSERT INTO users (email, password, name, phone_number, address, is_admin, balance)
            VALUES ($1, $2, $3, $4, $5, FALSE, 0);`,
            [email, hashedPassword, name, phoneNumber, address]
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
            return res.status(404).json({
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
                message: 'Incorrect password'
            });
        }

        const payload = {
            userId: user.id,
            name: user.name
        };

        const accessToken = jwt.sign(
            payload,
            config.jwt.accessSecret,
            { expiresIn: config.jwt.accessExpire }
        );

        await pool.query(
            'UPDATE users SET access_token=$1 WHERE email=$2;',
            [accessToken, email]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Successfully login',
            data: {
                accessToken
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

async function editUserProfile(req, res) {
    const { password, name, phoneNumber, address } = req.body;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;
    let foundUser;
    try {
        foundUser = await pool.query(
            'SELECT * FROM users WHERE id=$1;',
            [userId]
        );

        if (!foundUser.rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }

    const user = foundUser.rows[0];
    const newPassword = password ? password : user.password;
    const newName = name ? name : user.name;
    const newPhoneNumber = phoneNumber ? phoneNumber : user.phone_number;
    const newAddress = address ? address : user.address;

    try {
        await pool.query(
            `
                UPDATE users SET password=$1, name=$2, phone_number=$3, address=$4
                WHERE id=$5;
            `,
            [newPassword, newName, newPhoneNumber, newAddress, userId]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Successfully updated a user profile'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

async function logoutUser(req, res) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const user = await pool.query(
            'UPDATE users SET access_token=NULL WHERE id=$1 RETURNING *;',
            [userId]
        );

        if (!user.rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Successfully logout'
        });
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

async function getUser(req, res) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const user = await pool.query(
            'SELECT id, email, name, phone_number, address, balance, is_admin FROM users WHERE id=$1;',
            [userId]
        );

        if (!user.rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        const userData = user.rows[0];
        userData['phoneNumber'] = userData['phone_number'];
        delete userData['phone_number'];

        userData['isAdmin'] = userData['is_admin'];
        delete userData['is_admin'];

        return res.status(200).json({
            status: 'success',
            message: 'Successfully found user',
            data: {
                user: userData
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

async function editBalance(req, res) {
    const { balance } = req.body;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const rawUser = await pool.query(
            'SELECT * FROM users WHERE id=$1;',
            [userId]
        );

        if (!rawUser.rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found'
            });
        }

        const updatedBalance = rawUser.rows[0].balance + balance;

        await pool.query(
            'UPDATE users SET balance=$1 WHERE id=$2;',
            [updatedBalance, userId]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Successfully edited user balance'
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

module.exports = {
    addNewUser,
    loginUser,
    editUserProfile,
    logoutUser,
    getUser,
    editBalance
};