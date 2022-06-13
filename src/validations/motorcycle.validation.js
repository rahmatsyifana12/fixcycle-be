const joi = require('joi');

// const MotorcycleType = {
//     CUB: 1,
//     SCOOTER: 2,
//     SPORT: 3
// };

const newMotorcycleSchema = joi.object({
    licensePlate: joi.string()
        .alphanum()
        .required(),

    name: joi.string()
        .min(3)
        .max(64)

        .required(),

    brand: joi.string()
        .required(),

    type: joi.string()
        .required(),

    cylinderCapacity: joi.number()
        .required(),

    productionYear: joi.date()
        .required(),

    color: joi.string()
        .required(),

    fuelType: joi.string()
        .required()
});

const editMotorcycleSchema = joi.object({
    licensePlate: joi.string()
        .alphanum(),

    name: joi.string()
        .min(3)
        .max(64),

    brand: joi.string(),

    type: joi.string(),

    cylinderCapacity: joi.number(),

    productionYear: joi.date(),

    color: joi.string(),

    fuelType: joi.string()
});

module.exports = {
    newMotorcycleSchema,
    editMotorcycleSchema
};