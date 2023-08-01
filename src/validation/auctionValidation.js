const Joi = require('joi');
const mongoose = require('mongoose');



const createAuctionSchema = Joi.object({
    carId: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    startingPrice: Joi.number().integer().min(1).required(),
    status: Joi.string().valid('Pending', 'Active', 'Closed').default('Pending').required(),
    highestBid: Joi.number().integer().min(0).default(0),
    winner: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).optional(),
    approvalTime: Joi.date().iso().allow(null),
    vehicleAddress: Joi.string().allow(null),
    missingDetails: Joi.string().allow(null),
    note: Joi.string().allow(null),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().min(Joi.ref('startTime')).required(),
});

module.exports = {
    createAuctionSchema,
};
