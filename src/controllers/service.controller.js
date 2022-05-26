const jwt = require('jsonwebtoken');
const pool = require("../db");

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
            `INSERT INTO services (user_id, motorcycle_id, service_type, service_request, service_time, created_at)
            VALUES ($1, $2, $3, $4, current_timestamp, current_timestamp);`,
            [userId, 1, serviceType, serviceRequest]
        );

        return res.status(201).json({
            status: 'success',
            message: 'Successfully added a new service'
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
    getAllServices,
    addNewService
};