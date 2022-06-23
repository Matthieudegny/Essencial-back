const Joi = require('joi');

const textRule = Joi.string().min(2).pattern(/^[a-zA-ZÀ-ÿ0-9 ']+$/);

module.exports = Joi.object({
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._-]{1,64}@([a-zA-Z0-9-]{2,252}\.[a-zA-Z.]{2,6})$/)
        .required(),
    first_name: textRule
        .required(),
    last_name: textRule
        .required(),
    pseudo: textRule
        .required(),
    description: Joi.string(),
    date_of_birth: Joi.string(),
    password: Joi.string()
        /* .pattern(/^(?=.*[0-9])(?=.*[az])(?=.*[AZ])(?=.*[@#$%^&-+=() ])(?=\\S+$).{8, 20}$/) */
        .required(),
    rights: Joi.string()
        .pattern(/^user|admin$/),
    phone_number: Joi.string()
        .pattern(/^(0|\+33)[ .-]?[1-9]([ .-]?[0-9]){8}$/),
    address: textRule,
    region: textRule
        .required(),
    zip_code: textRule,
    city: textRule,
    path: Joi.string()
}).required();
