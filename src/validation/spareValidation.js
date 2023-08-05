const Joi = require('joi');
const mongoose = require('mongoose');




module.exports.createSparePartSchema = Joi.object({
    name: Joi.string().required(),
    brand: Joi.string().custom((value, helpers) => {
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
    description: Joi.string().required(),
    price: Joi.number().min(0).required(),
    quantity: Joi.number().integer().min(1).required(),
    image: Joi.string().required(),
});


module.exports.getSpecificSparePartSchema = Joi.object({
    sparePartId: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
});



module.exports.searchSparePartsSchema = Joi.object({
    searchQuery: Joi.string().required(),
});

