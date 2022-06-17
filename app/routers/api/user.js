const express = require('express');
const router = express.Router();
const userController = require('../../controllers/api/user');
const validator = require('../../validation/validator');
const checkAuth = require('../../middlewares/checkAuth');
const userGetSchema = require('../../validation/schemas/user/userGet.schema');


router.route('/')
/**
 * GET /api/users
 * @summary To get all users with their photos
 * @tags User
 * @return {User} 200 - success response
 * @return {object} 400 - input data invalid
 */
/*.get(validator('query', userGetSchema), userController.getAll) */
.get(userController.getAllWithPhotos)

        
router.route('/connexion')
/**
* POST /api/user/connexion
* @summary To verified if email match with password
* @tags User
* @param  {object} request.body.required - user object with only email and password
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.post(userController.verifyAuthentification) 
        
router.route('/create')
/**
 * POST /api/user/create
 * @summary To create one user
 * @tags User
 * @param {object} request.body.required - user object with all user's info + path: (photo path)
 * @return {object} 200 - success response
 * @return {object} 400 - input data invalid
 */
.post(userController.createOneWithPhoto)

router.route('/:id(\\d+)') 
/**
* GET /api/user/{id}
* @summary To get one user with his photo
* @tags User
* @param {number} id.path.required - user identifier
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.get(userController.getOneWithPhoto) 
/**
* DELETE /api/user/{id}
* @summary To delete one user with his photo
* @tags User
* @param {number} id.path.required - user identifier
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.delete(userController.deleteOne)

router.route('/friends/:id(\\d+)') 
/**
* GET /api/user/friends/{id}
* @summary To get all user's friends
* @tags User
* @param {number} id.path.required - user identifier
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.get(userController.getAllFriends) 

router.route('/posts/:id(\\d+)') 
/**
* GET /api/user/posts/{id}
* @summary To get all user's posts
* @tags User
* @param {number} id.path.required - user identifier
* @return {object} 200 - success response
* @return {ApiError} 400 - input data invalid
*/
.get(userController.getAllPostsWithPhoto) 

module.exports = router


