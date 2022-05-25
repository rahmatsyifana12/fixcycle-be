const jwt = require('jsonwebtoken');
const pool = require("../db");

async function addNewMotorcycle(req, res) {
    const {
        lisencePlate,
        ownerName,
        brand, type,
        cylinder_capacity,
        production_year,
        color,
        fuel_type
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
            `INSERT INTO motorcycles  (lisence_plate, owner_name, brand, type, cyclinder_capacity,
                production_year, color, fuel_type) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);`,
                [
                    lisencePlate, ownerName, brand, type,
                    cylinder_capacity, production_year, color, fuel_type
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

module.exports = {
    addNewMotorcycle
};