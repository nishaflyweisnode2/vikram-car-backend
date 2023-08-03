const Joi = require('joi');
const mongoose = require('mongoose');


module.exports.transportServiceSchema = Joi.object({
    serviceType: Joi.string().required(),
    fromLocation: Joi.string().required(),
    toLocation: Joi.string().required(),
    vehicleType: Joi.string().required(),
    vehicleNumber: Joi.string().required(),
    contactNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    vehicleCondition: Joi.string(),
    vehicleWheelCondition: Joi.string(),
    additionalDetails: Joi.string(),
});


