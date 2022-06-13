const jwt = require('jsonwebtoken');
const pool = require("../db");

async function addNewMotorcycle(req, res) {
    const {
        licensePlate,
        name,
        brand, type,
        cylinderCapacity,
        fuelType,
        productionYear,
        color
    } = req.body;
    const accessToken = req.headers['authorization'].split(' ')[1];
    const userId = jwt.decode(accessToken).userId;

    try {
        const motorcycles = await pool.query(
            'SELECT * FROM motorcycles WHERE user_id=$1 AND license_plate=$2;',
            [userId, licensePlate]
        );

        if (motorcycles.rowCount > 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'This motorcycle is already exist in this account'
            });
        }

        await pool.query(
            `INSERT INTO motorcycles  (user_id, license_plate, name, brand, type, cylinder_capacity,
                fuel_type, production_year, color) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9);`,
                [
                    userId,
                    licensePlate,
                    name,
                    brand, type,
                    cylinderCapacity,
                    fuelType,
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
        const rawMotorcycles = await pool.query(
            'SELECT * FROM motorcycles WHERE user_id=$1;',
            [userId]
        );

        const motorcycles = rawMotorcycles.rows.map((motorcycle) => {
            motorcycle['licensePlate'] = motorcycle['license_plate'];
            delete motorcycle['license_plate'];

            motorcycle['userId'] = motorcycle['user_id'];
            delete motorcycle['user_id'];

            motorcycle['cylinderCapacity'] = motorcycle['cylinder_capacity'];
            delete motorcycle['cylinder_capacity'];

            motorcycle['fuelType'] = motorcycle['fuel_type'];
            delete motorcycle['fuel_type'];

            return motorcycle;
        })

        return res.status(200).json({
            status: 'success',
            message: 'Found all motorcycles for user',
            data: {
                motorcycles
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

        const rawMotorcycle = await pool.query(
            'SELECT * FROM motorcycles WHERE id=$1;',
            [motorcycleId]
        );

        if (!rawMotorcycle.rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'Motorcycle not found'
            });
        }

        const motorcycle = rawMotorcycle.rows[0];
        motorcycle['licensePlate'] = motorcycle['license_plate'];
        delete motorcycle['license_plate'];

        motorcycle['userId'] = motorcycle['user_id'];
        delete motorcycle['user_id'];

        motorcycle['cylinderCapacity'] = motorcycle['cylinder_capacity'];
        delete motorcycle['cylinder_capacity'];

        motorcycle['fuelType'] = motorcycle['fuel_type'];
        delete motorcycle['fuel_type'];

        motorcycle['productionYear'] = motorcycle['production_year'];
        delete motorcycle['production_year'];

        if (user.rows[0].is_admin) {
            return res.status(200).json({
                status: 'success',
                message: 'Found motorcycle',
                data: {
                    motorcycle: motorcycle.rows[0]
                }
            });
        }

        if (motorcycle.userId !== userId) {
            return res.status(404).json({
                status: 'fail',
                message: 'Motorcycle not found'
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'Found motorcycle',
            data: {
                motorcycle
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
        licensePlate,
        name,
        brand, type,
        cylinderCapacity,
        fuelType,
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
        const newLicensePlate = licensePlate ? licensePlate : motorcycle.license_plate;
        const newName = name ? name : motorcycle.name;
        const newBrand = brand ? brand : motorcycle.brand;
        const newType = type ? type : motorcycle.type;
        const newCylinderCapacity = cylinderCapacity ? cylinderCapacity : motorcycle.cylinder_capacity;
        const newFuelType = fuelType ? fuelType : motorcycle.fuel_type;
        const newProductionYear = productionYear ? productionYear : motorcycle.production_year;
        const newColor = color ? color : motorcycle.color;

        await pool.query(
            `
                UPDATE motorcycles
                SET license_plate=$1, name=$2, brand=$3, type=$4, cylinder_capacity=$5,
                fuel_type=$6, production_year=$7, color=$8
                WHERE id=$9 AND user_id=$10;
            `,
            [newLicensePlate, newName, newBrand, newType, newCylinderCapacity, newFuelType,
                newProductionYear, newColor, motorcycleId, userId]
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

        const motorcycleToBeDeleted = await pool.query(
            'DELETE FROM motorcycles WHERE id=$1 AND user_id=$2 RETURNING *;',
            [motorcycleId, userId]
        );

        if (!motorcycleToBeDeleted.rowCount) {
            return res.status(404).json({
                status: 'fail',
                message: 'Motorcycle not found'
            });
        }

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