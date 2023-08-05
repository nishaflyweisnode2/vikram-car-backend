const Joi = require('joi');


module.exports.createTermsAndConditionsSchema = Joi.object({
    content: Joi.string().required(),
});

