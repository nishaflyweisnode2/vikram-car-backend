const Joi = require('joi');
const mongoose = require('mongoose');



const inspectionSchema = Joi.object({
    auction: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    car: Joi.string().required(),
    requestedBy: Joi.string().required(),
    inspectionDate: Joi.date().required(),
    inspectionType: Joi.string().required(),
    notes: Joi.string(),
});

const validateCreateInspection = (req, res, next) => {
    const { error } = inspectionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: 400, message: error.details[0].message });
    }
    next();
};


const updateInspectionSchema = Joi.object({
    auction: Joi.string().custom((value, helpers) => {
        if (!mongoose.isValidObjectId(value)) {
            return helpers.error('any.invalid');
        }
        return value;
    }).required(),
    car: Joi.string().required(),
    requestedBy: Joi.string().required(),
    inspectionDate: Joi.date().required(),
    inspectionType: Joi.string().required(),
    notes: Joi.string(),
});

const validateUpdateInspection = (req, res, next) => {
    const { error } = updateInspectionSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ status: 400, message: error.details[0].message });
    }
    next();
};


module.exports = {
    validateCreateInspection,
};
