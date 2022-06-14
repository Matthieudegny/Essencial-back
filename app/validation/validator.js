/**
 * Middleware factory for Joi validation
 * @param {string} sourceData - possible values [query | body | params]
 * @param {Object} schema - Joi object schema
 * @returns middleware function
 */

 function validator(sourceData, schema) {
    // validator n'est pas un middleware mais une factory de middleware, c'est une fonction qui va
    // renvoyer une autre function qui elle sera une fonction de middleware
    return async (request, response, next) => {
        try {
            // request[sourceData] ---> request.query ou request.body ou request.params
            await schema.validateAsync(request[sourceData]);
            next();
        } catch (err) {
            response.json({ error: err.details[0].message });
        }
    };
}

module.exports = validator;