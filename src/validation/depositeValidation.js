const Joi = require('joi');



module.exports.createSecurityDepositValidationSchema = Joi.object({
    amount: Joi.number().positive().required(),
});

