const Joi = require('joi');
const mongoose = require('mongoose');


module.exports.sellCarSchema = Joi.object({
    brand: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    name: Joi.string().optional(),
    buyingOption: Joi.string().optional(),
    price: Joi.number().optional(),
    model: Joi.string().optional(),
    variant: Joi.string().optional(),
    fuelType: Joi.string().optional(),
    description: Joi.string().optional(),
    image: Joi.array().items(Joi.string()).optional(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
    mileage: Joi.number().integer().min(0).optional(),
    owner: Joi.string().optional(),
    color: Joi.string().optional(),
    transmission: Joi.string().optional(),
    engineSize: Joi.string().optional(),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    rto: Joi.string().optional(),
    documentStatus: Joi.string().optional(),
    totalKm: Joi.number().optional(),
});