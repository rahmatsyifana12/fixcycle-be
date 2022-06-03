const jwt = require('jsonwebtoken');
const moment = require('moment');
const pool = require("../db");

async function getAllServices(req, res) {
    try {
        const services = await pool.query(
            'SELECT * FROM services;'
        );

        return res.status(200).json({
            status: 'success',
            message: 'Services found',
            data: {
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

async function getAllServicesForUser(req, res) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const services = await pool.query(
            'SELECT * FROM services WHERE user_id=$1;',
            [userId]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Services found',
            data: {
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
    const { motorcycleId } = req.params;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;
    const dateNow = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    try {
        await pool.query(
            `INSERT INTO services (user_id, motorcycle_id, type, request, service_time, status, created_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [userId, motorcycleId, serviceType, serviceRequest, '2022-01-31 14:12:00', 1, dateNow]
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

async function changeServiceStatus(req, res) {
    
}

module.exports = {
    getAllServices,
    addNewService,
    getAllServicesForUser,
    changeServiceStatus
};