const jwt = require('jsonwebtoken');
const moment = require('moment');
const pool = require("../db");
const { ServiceStatus, ServiceType, PaymentStatus } = require('../validations/service.validation');

function getInvoiceData(serviceType, pickUpAndDrop, cylinderCapacity) {
    const adminFee = 5000;
    let serviceTypeCost = 0;
    if (serviceType === ServiceType.FULL_SERVICE) {
        serviceTypeCost = 200000;
    } else {
        serviceTypeCost = 100000;
    }

    let additionalFee = 0;
    if (pickUpAndDrop) {
        additionalFee += 25000;
    }

    let cylinderCapacityCost = 0;
    if (cylinderCapacity < 150) {
        cylinderCapacityCost = 50000;
    }
    else if (cylinderCapacity >= 150 && cylinderCapacity < 250) {
        cylinderCapacityCost = 100000;
    }
    else if (cylinderCapacity >= 250) {
        cylinderCapacityCost = 150000;
    }

    const totalCost = serviceTypeCost + cylinderCapacityCost + additionalFee + adminFee;

    return { totalCost, serviceTypeCost, cylinderCapacityCost, additionalFee, adminFee };
}

async function getAllServices(req, res) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE id=$1;',
            [userId]
        );

        if (!user.rows[0].is_admin) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized error'
            });
        }

        const rawServices = await pool.query(
            'SELECT * FROM services;'
        );

        const services = rawServices.rows.map((service) => {
            service['userId'] = service['user_id'];
            delete service['user_id'];

            service['motorcycleId'] = service['motorcycle_id'];
            delete service['motorcycle_id'];

            service['serviceStatus'] = service['service_status'];
            delete service['service_status'];

            service['serviceTime'] = service['service_time'];
            delete service['service_time'];

            service['createdAt'] = service['created_at'];
            delete service['created_at'];

            service['pickUpAndDrop'] = service['pick_up_and_drop'];
            delete service['pick_up_and_drop'];

            return service;
        });

        return res.status(200).json({
            status: 'success',
            message: 'Services found',
            data: {
                services
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
        const rawServices = await pool.query(
            'SELECT * FROM services WHERE user_id=$1;', [userId]
        );

        const services = rawServices.rows.map((service) => {
            service['userId'] = service['user_id'];
            delete service['user_id'];

            service['motorcycleId'] = service['motorcycle_id'];
            delete service['motorcycle_id'];

            service['serviceStatus'] = service['service_status'];
            delete service['service_status'];

            service['serviceTime'] = service['service_time'];
            delete service['service_time'];

            service['createdAt'] = service['created_at'];
            delete service['created_at'];

            service['pickUpAndDrop'] = service['pick_up_and_drop'];
            delete service['pick_up_and_drop'];

            return service;
        });

        return res.status(200).json({
            status: 'success',
            message: 'Services found',
            data: {
                services
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
    const { motorcycleId, type, request, serviceTime, pickUpAndDrop } = req.body;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;
    const dateNow = moment(Date.now()).format('YYYY-MM-DD HH:mm:ss');

    try {
        await pool.query(
            `
                INSERT INTO services (user_id, motorcycle_id, type, request, service_time,
                    service_status, pick_up_and_drop, created_at)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
            `, [userId, motorcycleId, type, request, serviceTime, ServiceStatus.PENDING, pickUpAndDrop, dateNow]
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
            'SELECT * FROM users WHERE id=$1 AND is_admin=TRUE;',
            [userId]
        );

        if (!isAdmin.rowCount) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized error'
            });
        }

        const serviceToBeChanged = await pool.query(
            'UPDATE services SET service_status=$1 WHERE id=$2 RETURNING *;',
            [serviceStatus, serviceId]
        );

        if (!serviceToBeChanged.rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'Service not found'
            });
        }

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

async function getServiceById(req, res) {
    const { serviceId } = req.params;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE id=$1;',
            [userId]
        );

        const rawService = await pool.query(
            'SELECT * FROM services WHERE id=$1;',
            [serviceId]
        );

        if (rawService.rows[0].rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'Service not found'
            });
        }

        const service = rawService.rows[0];
        service['userId'] = service['user_id'];
        delete service['user_id'];

        service['motorcycleId'] = service['motorcycle_id'];
        delete service['motorcycle_id'];

        service['serviceStatus'] = service['service_status'];
        delete service['service_status'];

        service['serviceTime'] = service['service_time'];
        delete service['service_time'];

        service['createdAt'] = service['created_at'];
        delete service['created_at'];

        service['pickUpAndDrop'] = service['pick_up_and_drop'];
        delete service['pick_up_and_drop'];

        if (user.rows[0].is_admin) {
            return res.status(200).json({
                status: 'success',
                message: 'Found service',
                data: {
                    service
                }
            });
        }

        if (service.userId !== userId) {
            return res.status(404).json({
                status: 'fail',
                message: 'Service not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Found service',
            data: {
                service
            }
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

async function getInvoiceDetails(req, res) {
    const { serviceId } = req.params;

    try {
        const rawInvoice = await pool.query(
            'SELECT * FROM invoices WHERE service_id=$1;',
            [serviceId]
        );

        const rawService = await pool.query(
            'SELECT * FROM services WHERE id=$1;',
            [serviceId]
        );

        const serviceType = rawService.rows[0].type;
        const motorcycleId = rawService.rows[0].motorcycle_id;
        const pickUpAndDrop = rawService.rows[0].pick_up_and_drop;

        const rawMotorcycle = await pool.query(
            'SELECT cylinder_capacity FROM motorcycles WHERE id=$1;',
            [motorcycleId]
        );

        const cylinderCapacity = rawMotorcycle.rows[0].cylinder_capacity;

        const {
            totalCost, serviceTypeCost, cylinderCapacityCost, additionalFee, adminFee
        } = getInvoiceData(serviceType, pickUpAndDrop, cylinderCapacity);

        return res.status(200).json({
            status: 'success',
            message: 'Successfully found invoice details',
            data: {
                totalCost,
                serviceTypeCost,
                cylinderCapacityCost,
                additionalFee,
                adminFee,
                isPaid: rawInvoice.rows[0].is_paid
            }
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

async function addInvoice(req, res) {
    const { serviceId } = req.params;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const isAdmin = await pool.query(
            'SELECT * FROM users WHERE id=$1 AND is_admin=TRUE;',
            [userId]
        );

        if (!isAdmin.rowCount) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized error'
            });
        }

        const serviceToBeAddInvoice = await pool.query(
            'SELECT * FROM services WHERE id=$1;',
            [serviceId]
        );

        if (serviceToBeAddInvoice.rows[0].service_status !== ServiceStatus.DONE) {
            return res.status(400).json({
                status: 'success',
                message: 'Service is not done or has been canceled'
            });
        }

        const serviceType = rawService.rows[0].type;
        const motorcycleId = rawService.rows[0].motorcycle_id;
        const pickUpAndDrop = rawService.rows[0].pick_up_and_drop;

        const rawMotorcycle = await pool.query(
            'SELECT cylinder_capacity FROM motorcycles WHERE id=$1;',
            [motorcycleId]
        );

        const cylinderCapacity = rawMotorcycle.rows[0].cylinder_capacity;

        const { totalCost } = getInvoiceData(serviceType, pickUpAndDrop, cylinderCapacity);

        await pool.query(`
        INSERT INTO invoices (service_id, total_cost, is_paid) VALUES ($1, $2, FALSE)
        `, [serviceId, totalCost]);

        return res.status(200).json({
            status: 'success',
            message: 'Successfully add an invoice'
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

async function deleteService(req, res) {
    const { serviceId } = req.params;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const rawService = await pool.query(
            'SELECT * FROM services WHERE id=$1 AND user_id=$2;',
            [serviceId, userId]
        );

        if (!rawService.rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'Service not found'
            });
        }

        if (rawService.rows[0].status === ServiceStatus.ONGOING) {
            return res.status(404).json({
                status: 'fail',
                message: 'Fail to delete service'
            });
        }

        await pool.query(
            'DELETE from services WHERE id=$1 AND user_id=$2;',
            [serviceId, userId]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Successfully add a payment'
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

async function payInvoice(req, res) {
    const { serviceId } = req.params;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const rawUser = await pool.query(
            'SELECT * FROM users WHERE id=$1;',
            [userId]
        );

        if (!rawUser.rowCount) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized error'
            });
        }
        const user = rawUser.rows[0];

        const rawInvoice = await pool.query(
            'SELECT * FROM invoices WHERE service_id=$1;',
            [serviceId]
        );
        const invoice = rawInvoice.rows[0];

        if (invoice.total_cost > user.balance) {
            return res.status(400).json({
                status: 'fail',
                message: 'Your balance is not enough'
            });
        }

        const newBalance = user.balance - invoice.total_cost;
        await pool.query(
            'UPDATE users SET balance=$1 WHERE id=$2;',
            [newBalance, userId]
        );

        await pool.query(
            'UPDATE invoices SET is_paid=TRUE WHERE id=$1;',
            [invoice.id]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Successfully paid an invoice'
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
    changeServiceStatus,
    getServiceById,
    getInvoiceDetails,
    addInvoice,
    deleteService,
    payInvoice
};