const Joi = require('joi');
const mongoose = require('mongoose');


module.exports.carSchema = Joi.object({
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
    imageLinks: Joi.array().items(Joi.string()).optional(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    mileage: Joi.number().integer().min(0).required(),
    owner: Joi.string().required(),
    ownerType: Joi.string().required(),
    isUsed: Joi.boolean().required(),
    isScrap: Joi.boolean().required(),
    color: Joi.string(),
    transmission: Joi.string(),
    engineSize: Joi.string(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    rto: Joi.string().required(),
    documentStatus: Joi.string().required(),
});


module.exports.updatecarSchema = Joi.object({
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
    imageLinks: Joi.array().items(Joi.string()).optional(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).optional(),
    mileage: Joi.number().integer().min(0).optional(),
    owner: Joi.string().optional(),
    ownerType: Joi.string().optional(),
    isUsed: Joi.boolean().optional(),
    isScrap: Joi.boolean().optional(),
    color: Joi.string(),
    transmission: Joi.string(),
    engineSize: Joi.string(),
    state: Joi.string().optional(),
    city: Joi.string().optional(),
    rto: Joi.string().optional(),
    documentStatus: Joi.string().optional(),
});


module.exports.getCarsByBuyingOptionSchema = Joi.object({
    buyingOption: Joi.string().valid('Live Auction', 'Ready to Lift', 'Used Vehicles', 'Scrap-Spare').required(),
});


module.exports.searchCarsSchema = Joi.object({
    brand: Joi.string().optional(),
    rto: Joi.string().optional(),
    filter: Joi.string().valid('mileage', 'totalKm', 'price', 'year').optional(),
});


module.exports.compareCarsSchema = Joi.object({
    car1Id: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    car2Id: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
});



module.exports.buyCarValidationSchema = Joi.object({
    carId: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
});