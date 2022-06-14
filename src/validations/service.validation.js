const joi = require('joi');

const ServiceStatus = {
    PENDING: 1,
    ONGOING: 2,
    DONE: 3,
    CANCELED: 4
};

const ServiceType = {
    FULL_SERVICE: 1,
    LIGHT_SERVICE: 2
};

const PaymentStatus = {
    PENDING: 1,
    DONE: 2,
}

const newServiceSchema = joi.object({

});

module.exports = {
    ServiceStatus,
    ServiceType,
    newServiceSchema,
    PaymentStatus
};