const joi = require('joi');

function validate(schema, isParams = false) {
    return (req, res, next) => {
        let targetToValidate;

        if (isParams) {
            targetToValidate = req.params;
        } else {
            targetToValidate = req.body;
        }

        const result = schema.validate(targetToValidate);
        if (result.error) {
            return res.status(400).json({
                status: 'fail',
                message: result.error.message
            });
        }

        return next();
    }
}

module.exports = { validate };