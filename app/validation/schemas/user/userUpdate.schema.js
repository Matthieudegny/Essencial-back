const Joi = require('joi');

const textRule = Joi.string().min(2).pattern(/^[a-zA-ZÀ-ÿ0-9 ']+$/);

module.exports = Joi.object({
    email: Joi.string()
    .pattern(/^[a-zA-Z0-9._-]{1,64}@([a-zA-Z0-9-]{2,252}\.[a-zA-Z.]{2,6})$/)
        .allow(null),
    first_name: Joi.string()
        .allow(null),
    last_name: Joi.string()
        .allow(null),
    pseudo: textRule
        .allow(null),
    description: Joi.string()
        .allow(null),
    date_of_birth: Joi.string()
        .allow(null),
    password: Joi.string()
        /* .pattern(/^(?=.*[0-9])(?=.*[az])(?=.*[AZ])(?=.*[@#$%^&-+=() ])(?=\\S+$).{8, 20}$/) */
        .allow(null),
    rights: Joi.string()
        .pattern(/^user|admin$/)
        .allow(null),
    phone_number: Joi.string()
        .pattern(/^(0|\+33)[ .-]?[1-9]([ .-]?[0-9]){8}$/)
        .allow(null),
    address: Joi.string()
        .allow(null),
    region: Joi.string()
        .allow(null),
    zip_code: textRule
        .allow(null),
    city: Joi.string()
        .allow(null),
    path: Joi.string()
        .allow(null)
}).min(1).required();
