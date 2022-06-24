const Joi = require('joi');

const textRule = Joi.string().min(2).pattern(/^[a-zA-ZÀ-ÿ0-9 ']+$/);

module.exports = Joi.object({
    content: Joi.string()
        .required(),
    title: Joi.string()
        .required(),
    category_1: Joi.string()
        .required(),
    category_2: Joi.string(),
    path: Joi.string()
        .required()
}).required();