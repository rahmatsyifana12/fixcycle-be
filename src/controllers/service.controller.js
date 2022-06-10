const jwt = require('jsonwebtoken');
const moment = require('moment');
const pool = require("../db");
const { ServiceStatus } = require('../validations/service.validation');

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
            'SELECT * FROM services WHERE user_id=$1;', [userId]
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
    const { motorcycleId, serviceType, serviceRequest, serviceTime } = req.body;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;
    const dateNow = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    try {
        await pool.query(
            `
                INSERT INTO services (user_id, motorcycle_id, type, request, service_time, status, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7);
            `, [userId, motorcycleId, serviceType, serviceRequest, serviceTime, ServiceStatus.PENDING, dateNow]
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
    const { serviceStatus } = req.body;
    const { serviceId } = req.params;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const isAdmin = await pool.query(
            'SELECT * FROM users WHERE id=$1;',
            [userId]
        );

        if (!isAdmin.rowCount) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized error'
            });
        }

        await pool.query(
            'UPDATE services SET status=$1 WHERE id=$2;',
            [serviceStatus, serviceId]
        );

        return res.status(201).json({
            status: 'success',
            message: 'Successfully updated a service status'
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
    addNewService,
    getAllServicesForUser,
    changeServiceStatus
};