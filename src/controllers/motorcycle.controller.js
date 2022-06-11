const jwt = require('jsonwebtoken');
const pool = require("../db");

async function addNewMotorcycle(req, res) {
    const {
        lisencePlate,
        ownerName,
        brand, type,
        cylinderCapacity,
        productionYear,
        color
    } = req.body;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const motorcycles = await pool.query(
            'SELECT * FROM motorcycles WHERE user_id=$1 AND lisence_plate=$2;',
            [userId, lisencePlate]
        );

        if (motorcycles.rowCount > 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'This motorcycle is already exist in this account'
            });
        }

        await pool.query(
            `INSERT INTO motorcycles  (user_id, lisence_plate, owner_name, brand, type, cylinder_capacity,
                production_year, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
                [
                    userId,
                    lisencePlate,
                    ownerName,
                    brand, type,
                    cylinderCapacity,
                    productionYear,
                    color
                ]
        );

        return res.status(201).json({
            status: 'success',
            message: 'Successfully added a new motorcycle'
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

async function getAllMotorcyclesForUser(req, res) {
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const motorcycles = await pool.query(
            'SELECT * FROM motorcycles WHERE user_id=$1;',
            [userId]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Found all motorcycles for user',
            data: {
                motorcycles: motorcycles.rows
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

async function getMotorcycleById(req, res) {
    const { motorcycleId } = req.params;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const user = await pool.query(
            'SELECT * FROM users WHERE id=$1;',
            [userId]
        );

        const motorcycle = await pool.query(
            'SELECT * FROM motorcycles WHERE id=$1;',
            [motorcycleId]
        );

        if (!motorcycle.rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'Motorcycle not found'
            });
        }

        if (!user.rows[0].is_admin && motorcycle.rows[0].user_id !== userId) {
            return res.status(401).json({
                status: 'fail',
                message: 'Unauthorized error'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Found motorcycle',
            data: {
                motorcycle: motorcycle.rows[0]
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

async function editMotorcycle(req, res) {
    const {
        lisencePlate,
        ownerName,
        brand, type,
        cylinderCapacity,
        productionYear,
        color
    } = req.body;
    const { motorcycleId } = req.params;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const  foundMotorcycle = await pool.query(
            'SELECT * FROM motorcycles WHERE id=$1;',
            [motorcycleId]
        );

        if (!foundMotorcycle.rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'Motorcycle not found'
            });
        }

        const motorcycle = foundMotorcycle.rows[0];
        const newLisencePlate = lisencePlate ? lisencePlate : motorcycle.lisence_plate;
        const newOwnerName = ownerName ? ownerName : motorcycle.owner_name;
        const newBrand = brand ? brand : motorcycle.brand;
        const newType = type ? type : motorcycle.type;
        const newCylinderCapacity = cylinderCapacity ? cylinderCapacity : motorcycle.cylinder_capacity;
        const newProductionYear = productionYear ? productionYear : motorcycle.production_year;
        const newColor = color ? color : motorcycle.color;

        await pool.query(
            `
                UPDATE motorcycles
                SET lisence_plate=$1, owner_name=$2, brand=$3, type=$4, cylinder_capacity=$5,
                production_year=$6, color=$7
                WHERE id=$8 AND user_id=$9;
            `,
            [newLisencePlate, newOwnerName, newBrand, newType, newCylinderCapacity, newProductionYear, newColor, motorcycleId, userId]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Successfully updated a motorcycle'
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            status: 'fail',
            message: 'Unexpected server error'
        });
    }
}

async function deleteMotorcycle(req, res) {
    const { motorcycleId } = req.params;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const service = await pool.query(
            'SELECT * FROM services WHERE user_id=$1 AND motorcycle_id=$2;',
            [userId, motorcycleId]
        );

        if (service.rowCount > 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'Failed to delete motorcycle'
            });
        }

        await pool.query(
            'DELETE FROM motorcycles WHERE id=$1 AND user_id=$2;',
            [motorcycleId, userId]
        );

        return res.status(200).json({
            status: 'success',
            message: 'Successfully deleted a motorcycle'
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
    addNewMotorcycle,
    getAllMotorcyclesForUser,
    getMotorcycleById,
    editMotorcycle,
    deleteMotorcycle
};