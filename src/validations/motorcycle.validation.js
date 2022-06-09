const joi = require('joi');

// const MotorcycleType = {
//     CUB: 1,
//     SCOOTER: 2,
//     SPORT: 3
// };

const newMotorcycleSchema = joi.object({
    lisencePlate: joi.string()
        .alphanum()
        .required(),

    ownerName: joi.string()
        .min(3)
        .max(64)

        .regex(/[a-zA-Z ]+/)
        .rule({ message: '{#label} must only be alphabet' })

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
        .required()
});

const editMotorcycleSchema = joi.object({
    lisencePlate: joi.string()
        .alphanum(),

    ownerName: joi.string()
        .min(3)
        .max(64)

        .regex(/[a-zA-Z ]+/)
        .rule({ message: '{#label} must only be alphabet' }),

    brand: joi.string(),

    type: joi.string(),

    cylinderCapacity: joi.number(),

    productionYear: joi.date(),

    color: joi.string()
});

module.exports = {
    MotorcycleType,
    newMotorcycleSchema,
    editMotorcycleSchema
};