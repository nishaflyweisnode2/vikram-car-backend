const Joi = require('joi');
const mongoose = require('mongoose');



module.exports.createSubscriptionSchema = Joi.object({
    price: Joi.number().required(),
    time: Joi.string().required(),
    description: Joi.string().required(),
});



module.exports.buySubscriptionSchema = Joi.object({
    user: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    subscriptionId: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
});
