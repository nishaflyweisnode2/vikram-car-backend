const Joi = require('joi');
const mongoose = require('mongoose');


module.exports.contactUsSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    mobileNumber: Joi.string()
        .required()
        .pattern(/^\d{10}$/)
        .message('Phone number must be 10 digits and numeric'),
    message: Joi.string().required().trim(),
    message: Joi.string().required(),
});

