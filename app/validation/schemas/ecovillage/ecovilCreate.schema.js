const Joi = require('joi');

const textRule = Joi.string().min(2).pattern(/^[a-zA-ZÀ-ÿ0-9 ']+$/);

module.exports = Joi.object({
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._-]{1,64}@([a-zA-Z0-9-]{2,252}\.[a-zA-Z.]{2,6})$/)
        .required(),
    name: textRule
        .required(),
    first_name_manager: textRule
        .required(),
    last_name_manager: textRule
        .required(),
    description: Joi.string()
        .required(),
    date_of_birth_manager: Joi.string(),
    password: Joi.string()
        /* .pattern(/^(?=.*[0-9])(?=.*[az])(?=.*[AZ])(?=.*[@#$%^&-+=() ])(?=\\S+$).{8, 20}$/) */
        .required(),
    phone_number: Joi.string()
        .pattern(/^(0|\+33)[ .-]?[1-9]([ .-]?[0-9]){8}$/),
    address: textRule,
    region: textRule
        .required(),
    website: Joi.string(),
    zip_code: textRule,
    city: textRule,
    path: Joi.string()
}).required();
