const Joi = require('joi');


module.exports.carSchema = Joi.object({
    name: Joi.string().required(),
    buyingOption: Joi.string().required(),
    price: Joi.number().required(),
    model: Joi.string().required(),
    variant: Joi.string().required(),
    fuelType: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
    mileage: Joi.number().integer().min(0).required(),
    owner: Joi.string().required(),
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


module.exports.getCarsByBuyingOptionSchema = Joi.object({
    buyingOption: Joi.string().valid('Live Auction', 'Ready to Lift', 'Used Vehicles', 'Scrap-Spare').required(),
});
