const express = require('express');

const router = express.Router();
const userController = require('../../controllers/api/user');
const apiErrorController = require('../../controllers/api/error');
const validator = require('../../validation/validator');
/* const userGetSchema = require('../../validation/schemas/cadexGet.schema');
const userPostSchema = require('../../validation/schemas/cadexPost.schema'); */
/*
router.get('/cadex', cadexController.get);
router.post('/cadex', cadexController.post);
*/
// equivalent à

router.route('/user')
    /**
     * GET /api/users
     * @summary To get informations about users
     * @return {cadex} 200 - success response
     * @return {error} 400 - input data invalid
     */
    .get(validator('query', userGetSchema), userController.get)
    .post(validator('post', userPostSchema), userController.post);

router.use(apiErrorController.error404);

module.exports = router;