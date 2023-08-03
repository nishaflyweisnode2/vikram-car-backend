const Joi = require('joi');
const mongoose = require('mongoose');


// module.exports.addToFavouritesSchema = Joi.object({
//     userId: Joi.string().custom((value, helpers) => {
//         if (!mongoose.isValidObjectId(value)) {
//             return helpers.error('any.invalid');
//         }
//         return value;
//     }).required(),
//     carId: Joi.string().custom((value, helpers) => {
//         if (!mongoose.isValidObjectId(value)) {
//             return helpers.error('any.invalid');
//         }
//         return value;
//     }).required(),
// }),


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



module.exports.addMyBidSchema = Joi.object({
    auctionId: Joi.string().required().hex().length(24).custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    bidAmount: Joi.number().integer().required(),
})



module.exports.getMyWinsSchema = Joi.object({
    userId: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
});
