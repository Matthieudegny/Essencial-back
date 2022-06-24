const Joi = require('joi');

const textRule = Joi.string().min(2).pattern(/^[a-zA-ZÀ-ÿ0-9 ']+$/);

module.exports = Joi.object({
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._-]{1,64}@([a-zA-Z0-9-]{2,252}\.[a-zA-Z.]{2,6})$/),
    name: textRule,
    first_name_manager: textRule,
    last_name_manager: textRule,
    description: Joi.string(),
    date_of_birth_manager: Joi.string(),
    password: Joi.string()
        /* .pattern(/^(?=.*[0-9])(?=.*[az])(?=.*[AZ])(?=.*[@#$%^&-+=() ])(?=\\S+$).{8, 20}$/) */,
    phone_number: Joi.string()
        .pattern(/^(0|\+33)[ .-]?[1-9]([ .-]?[0-9]){8}$/),
    address: Joi.string(),
    region: textRule,
    website: Joi.string(),
    zip_code: textRule,
    city: textRule,
    path: Joi.string()
}).min(1).required();