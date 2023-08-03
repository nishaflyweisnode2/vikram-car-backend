const Joi = require('joi');
const mongoose = require('mongoose');


module.exports.sendEnquirySchema = Joi.object({
    iWant: Joi.string().required(),
    fromState: Joi.string().required(),
    toState: Joi.string().required(),
    vehicleNumber: Joi.string().required(),
    mobileNumber: Joi.string().required(),
    email: Joi.string().email().required(),
    ownedBy: Joi.string().required(),
    vehicleClass: Joi.string().required(),
    additionalQuestions: Joi.string().optional(),
});