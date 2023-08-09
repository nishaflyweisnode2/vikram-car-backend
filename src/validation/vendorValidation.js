const Joi = require('joi');
const mongoose = require('mongoose');



module.exports.signupValidationSchema = Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    mobileNumber: Joi.string()
        .pattern(/^[0-9]+$/)
        .length(10)
        .required(),
});


module.exports.addToFavouritesSchema = Joi.object({
    carId: Joi.string()
        .custom((value, helpers) => {
            if (!mongoose.isValidObjectId(value)) {
                return helpers.error('any.invalid');
            }
            return value;
        })
        .required(),
});


module.exports.workProfileUpdateSchema = Joi.object({
    selectYourCity: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    chooseYourServices: Joi.array().items(Joi.string()),
    chooseYourSector: Joi.string(),
    servicableDistance: Joi.string()
});


module.exports.documentsUpdateSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]+$/).length(10).required(),
    alternateMobile: Joi.string().allow(''),
    gender: Joi.string().valid('Male', 'Female', 'Other').required(),
    dateOfBirth: Joi.date(),
    addressLine1: Joi.string(),
    addressLine2: Joi.string(),
    panCardImage: Joi.array().items(Joi.string()),
    aadharCardImage: Joi.array().items(Joi.string()),
    selectYourDocument: Joi.string(),
    otherDocumentImage: Joi.array().items(Joi.string()),
});


