const joi = require('joi');

const ServiceStatus = {
    PENDING: 1,
    WAITING: 2,
    ONGOING: 3,
    FINISH: 4,
    DECLINED: 5
};

const ServiceType = {
    FULL_SERVICE: 1,
    LIGHT_SERVICE: 2
};

const newServiceSchema = joi.object({

});

module.exports = {
    ServiceStatus,
    ServiceType,
    newServiceSchema
};