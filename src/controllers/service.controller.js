const jwt = require('jsonwebtoken');
const pool = require("../db");

async function getServices(req, res) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;
    const name = jwt.decode(accessToken).name;

    try {
        const services = await pool.query(
            'SELECT * FROM services WHERE user_id=$1;',
            [userId]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Services found',
            data: {
                name,
                services: services.rows
            }
        });
    } catch (error) {
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

module.exports = {
    getServices
};