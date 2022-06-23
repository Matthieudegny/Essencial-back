const Joi = require('joi');

module.exports = Joi.object({
    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._-]{1,64}@([a-zA-Z0-9-]{2,252}\.[a-zA-Z.]{2,6})$/)
        .required(),
    password: Joi.string()
        /* .pattern(/^(?=.*[0-9])(?=.*[az])(?=.*[AZ])(?=.*[@#$%^&-+=() ])(?=\\S+$).{8, 20}$/) */
        .required(),
}).required();