const Joi = require('joi');

const textRule = Joi.string().min(2).pattern(/^[a-zA-ZÀ-ÿ0-9 ']+$/);

module.exports = Joi.object({
    email: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9._-]{1,64}@([a-zA-Z0-9-]{2,252}\.[a-zA-Z.]{2,6})$')),
    first_name: textRule,
    last_name: textRule,
    pseudo: textRule,
    date_of_birth: textRule,
    password: textRule,
    rights: textRule,
    phone_number: textRule,
    address: textRule,
    zip_code: textRule,
    city: textRule,
}).min(1);
