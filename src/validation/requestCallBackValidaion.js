const Joi = require('joi');

module.exports.callbackSchema = Joi.object({
    name: Joi.string().required().trim(),
    phoneNumber: Joi.string()
        .required()
        .pattern(/^\d{10}$/)
        .message('Phone number must be 10 digits and numeric'),
    message: Joi.string().required().trim(),
});

