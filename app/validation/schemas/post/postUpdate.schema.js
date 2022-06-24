const Joi = require('joi');

const textRule = Joi.string().min(2).pattern(/^[a-zA-ZÀ-ÿ0-9 ']+$/);

module.exports = Joi.object({
    content: Joi.string(),
    title: Joi.string(),
    category_1: Joi.string(),
    category_2: Joi.string(),
    path: Joi.string()
}).min(1).required();