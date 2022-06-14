const express = require('express');

const router = express.Router();
const userController = require('../../controllers/api/user');
const apiErrorController = require('../../controllers/api/error');
const validator = require('../../validation/validator');
const userGetSchema = require('../../validation/schemas/userGet.schema');
/* const userPostSchema = require('../../validation/schemas/cadexPost.schema'); */
/*
router.get('/cadex', cadexController.get);
router.post('/cadex', cadexController.post);
*/
// equivalent à

router.route('/users')
    /**
     * GET /api/users
     * @summary To get all users with their photos
     * @return {cadex} 200 - success response
     * @return {error} 400 - input data invalid
     */
/*     .get(validator('query', userGetSchema), userController.getAll) */
       .get(userController.getAllWithPhotos)

router.route('/user') 
    /**
     * GET /api/user
     * @summary To get one user with his photo
     * @return {cadex} 200 - success response
     * @return {error} 400 - input data invalid
    */
    .post(userController.getOneWithPhoto) 

router.route('/user/connexion')
    /**
     * POST /api/user/connexion
     * @summary To verified if email match with password
     * @return {cadex} 200 - success response
     * @return {error} 400 - input data invalid
    */
    .post(userController.verifyAuthentification) 
    
router.route('/user/create')
    /**
     * POST /api/user/create
     * @summary To create one user
     * @return {cadex} 200 - success response
     * @return {error} 400 - input data invalid
    */
   .post(userController.createOne)

router.route('/user/delete')
    /**
     * POST /api/user/delete
     * @summary To delete one user
     * @return {cadex} 200 - success response
     * @return {error} 400 - input data invalid
    */
   .delete(userController.deleteOne)

router.use(apiErrorController.error404);

module.exports = router;