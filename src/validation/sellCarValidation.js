const Joi = require('joi');
const mongoose = require('mongoose');


module.exports.sellCarSchema = Joi.object({
    brand: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    name: Joi.string().required(),
    buyingOption: Joi.string().required(),
    price: Joi.number().required(),
    model: Joi.string().required(),
    variant: Joi.string().required(),
    fuelType: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.array().items(Joi.string()).optional(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    mileage: Joi.number().integer().min(0).required(),
    owner: Joi.string().required(),
    color: Joi.string(),
    transmission: Joi.string(),
    engineSize: Joi.string(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    rto: Joi.string().required(),
    documentStatus: Joi.string().required(),
    totalKm: Joi.number().required(),
});