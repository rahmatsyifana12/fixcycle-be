const joi = require('joi');

const ServiceStatus = {
    PENDING: 1,
    WAITING: 2,
    ONGOING: 3,
    FINISH: 4,
    DECLINED: 5
};

const ServiceType = {
    FAST_TRACK: 1,
    LIGHT_SERVICE: 2,
    HEAVY_REPAIR: 3,
    CLAIM_SERVICE: 4
};

const newServiceSchema = joi.object({

});

module.exports = {
    ServiceStatus,
    ServiceType,
    newServiceSchema
};