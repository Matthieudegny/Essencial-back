const Joi = require('joi');

const textRule = Joi.string().min(2).pattern(/^[a-zA-ZÀ-ÿ0-9 ']+$/);

module.exports = Joi.object({
    user_id: Joi.number()
        .required(),
    content: textRule
        .required(),
    title: textRule
        .required()
/*     category_1: Joi.string()
        .required() */
}).required();