const Joi = require('joi');
const mongoose = require('mongoose');



module.exports.createOfferSchema = Joi.object({
    user: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    car: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    amount: Joi.number().positive().required(),
    description: Joi.string().required(),
});

