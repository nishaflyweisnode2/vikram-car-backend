const Joi = require('joi');
const mongoose = require('mongoose');



module.exports.createAuctionSchema = Joi.object({
    carId: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    startingPrice: Joi.number().integer().min(1).required(),
    status: Joi.string().valid('Pending', 'Active', 'Closed').default('Pending').required(),
    highestBid: Joi.number().integer().min(0).default(0),
    bidIncrement: Joi.number().integer().min(0).default(0),
    winner: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).optional(),
    vehicleAddress: Joi.string().allow(null),
    missingDetails: Joi.string().allow(null),
    note: Joi.string().allow(null),
    startTime: Joi.date().iso().required(),
    endTime: Joi.date().iso().min(Joi.ref('startTime')).required(),
});




module.exports.auctionUpdateSchema = Joi.object({
    auctionId: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    startingPrice: Joi.number().min(1).optional(),
    status: Joi.string().valid('Pending', 'Active', 'Closed'),
    highestBid: Joi.number().min(0).optional(),
    bidIncrement: Joi.number().min(0).optional(),
    winner: Joi.string().optional(),
    approvalTime: Joi.number().allow(null).optional(),
    vehicleAddress: Joi.string().optional(),
    missingDetails: Joi.string().optional(),
    note: Joi.string().optional(),
    startTime: Joi.date().optional(),
    endTime: Joi.date().greater(Joi.ref('startTime')).optional(),
});

