const joi = require('joi');

const passwordSchema = joi.string()
    .min(6)
    .max(64)

    .regex(/[0-9]/)
    .rule({ message: '{#label} requires at least a number' })

    .regex(/[a-z]/)
    .rule({ message: '{#label} requires at least a lowercase character' })

    .regex(/[A-Z]/)
    .rule({ message: '{#label} requires at least an uppercase character' });

const newUserSchema = joi.object({
    email: joi.string()
        .max(64)
        .email()
        .required(),

    password: passwordSchema.required(),

    name: joi.string()
        .min(3)
        .max(64)

        .regex(/[a-zA-Z ]+/)
        .rule({ message: '{#label} must only be alphabet' })

        .required(),

    phoneNumber: joi.string()
        .max(64)

        .regex(/[0-9]+/)
        .rule({ message: '{#label} must be numbers' }),

    address: joi.string()
        .max(255),

    balance: joi.number()
        .required(),

    isAdmin: joi.boolean()
        .required()
});

const editProfileSchema = joi.object({
    password: passwordSchema,

    name: joi.string()
        .min(3)
        .max(64)

        .regex(/[a-zA-Z ]+/)
        .rule({ message: '{#label} must only be alphabet' }),

    phoneNumber: joi.string()
        .max(64)

        .regex(/[0-9]+/)
        .rule({ message: '{#label} must be numbers' }),

    address: joi.string()
        .max(255),

    balance: joi.number(),

    isAdmin: joi.boolean()
});

module.exports = { newUserSchema, editProfileSchema };