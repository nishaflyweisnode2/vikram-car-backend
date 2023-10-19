const Joi = require('joi');
const mongoose = require('mongoose');


module.exports.bidSchema = Joi.object({
    userId: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    auctionId: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    amount: Joi.number().positive().required(),
    // bidLimit: Joi.number().positive().required(),
    // startBidAmount: Joi.number().positive().required(),
});


module.exports.bidUpdateSchema = Joi.object({
    bidId: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    bidAmount: Joi.number().min(1).optional(),
    autobidEnabled: Joi.boolean().optional(),
    autobidMaxBidAmount: Joi.number().min(0).optional(),
    bidIncrement: Joi.number().min(0).optional(),
    lastBidAmount: Joi.number().min(0).optional(),
    autobidMaxBids: Joi.number().min(0).optional(),
    bidLimit: Joi.number().min(0).optional(),
    autoDecreaseEnabled: Joi.boolean().optional(),
    decrementAmount: Joi.number().min(0).optional(),
    bidStatus: Joi.string().valid('Start Bidding', 'Winning', 'Losing').optional(),
    bidTime: Joi.date().optional(),
});