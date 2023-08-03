const Joi = require('joi');



module.exports.createBrandSchema = Joi.object({
    name: Joi.string().required(),
});
