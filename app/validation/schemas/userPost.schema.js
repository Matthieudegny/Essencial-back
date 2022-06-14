const Joi = require('joi');

const textRule = Joi.string().min(2).pattern(/^[a-zA-ZÀ-ÿ0-9 ']+$/);

module.exports = Joi.object({
    noun: textRule,
    adjective: textRule,
    verb: textRule,
    complement: textRule,
}).min(1).required();
