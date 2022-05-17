const jwt = require('jsonwebtoken');
const pool = require('../db');

function authenticate(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader.split(' ')[1];

        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);

        const userId = jwt.decode(token).userId;
        const user = await pool.query(
            'SELECT * FROM users WHERE id=$1;',
            [userId]
        );

        if (!user.rows[0].accessToken) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized error'
            });
        }

        return next();
    } catch (err) {
        return res.status(401).json({
            status: 'fail',
            message: 'Unauthorized error'
        });
    }
}

module.exports = { authenticate };