const jwt = require('jsonwebtoken');
const pool = require("../db");

const serviceTypes = {
    "FAST_TRACK": 1,
    "LIGHT_SERVICE": 2,
    "HEAVY_REPAIR": 3,
    "CLAIM_REPAIR": 4
};

async function getAllServices(req, res) {
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

async function addNewService(req, res) {
    const { serviceType, serviceRequest } = req.body;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        await pool.query(
            `INSERT INTO services (customer_id, motorcycle_id, service_type, service_request, service_time, created_at)
            VALUES ($1, $2, $3, $4, $5, );`,
            []
        )
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

module.exports = {
    getAllServices
};