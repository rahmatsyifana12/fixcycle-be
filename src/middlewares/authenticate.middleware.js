const jwt = require('jsonwebtoken');
const config = require('../configs/config');
const pool = require('../db');

async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader.split(' ')[1];

        jwt.verify(accessToken, config.jwt.accessSecret);

        const userId = jwt.decode(accessToken).userId;
        const user = await pool.query(
            'SELECT * FROM users WHERE id=$1;',
            [userId]
        );
            
        if (!user.rows[0].access_token) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized error'
            });
        }

        return next();
    } catch (error) {
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized error'
        });
    }
}

module.exports = { authenticate };