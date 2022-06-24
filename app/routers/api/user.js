const express = require('express');
const router = express.Router();
const userController = require('../../controllers/api/user');
const validate = require('../../validation/validator');
const checkAuth = require('../../middlewares/checkAuth');
const userCreateSchema = require('../../validation/schemas/user/userCreate.schema');
const userUpdateSchema = require('../../validation/schemas/user/userUpdate.schema');


router.route('/')
/**
 * GET /api/user
 * @summary To get all users with their photos
 * @tags User
 * @return {User} 200 - success response
 * @return {object} 400 - input data invalid
 */
.get(userController.getAllWithPhotos)

/**
* patch /api/user/
* @summary To update one user
* @security Bearer Auth
* @tags User
* @param {object} request.body.required - user's data to update
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.patch(checkAuth, validate('body',userUpdateSchema), userController.updateWithPhotoOrNot) 
        
router.route('/create')
/**
 * POST /api/user/create
 * @summary To create one user
 * @tags User
 * @param {object} request.body.required - user object with all user's info + path: (photo path)
 * @return {object} 200 - success response
 * @return {object} 400 - input data invalid
 */
.post(validate('body', userCreateSchema),userController.createOneWithPhoto)

router.route('/:id(\\d+)') 
/**
* GET /api/user/{id}
* @summary To get one user with his photo
* @tags User
* @param {number} id.path.required - user's id
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.get(userController.getOneWithPhoto) 

/**
* DELETE /api/user/{id}
* @summary To delete one user with his photo
* @tags User
* @param {number} id.path.required - user's id
* @security BearerAuth
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.delete(checkAuth, userController.deleteOne)

router.route('/friends/add/:id(\\d+)')
/**
 * GET /api/user/friends/add/{id}
 * @summary To add new friend
 * @tags User
 * @param {number} id.path.required - friend's id to add
 * @param {string} access_token.header.required - access_token
 * @return {object} 200 - success response
 * @return {object} 400 - input data invalid
 */
 .get(checkAuth, userController.addFriend)

router.route('/friends/delete/:id(\\d+)')
/**
 * DELETE /api/user/friends/delete/{id}
 * @summary To remove friend
 * @tags User
 * @param {number} id.path.required - friend's id to delete
 * @param {string} access_token.header.required - access_token
 * @return {object} 200 - success response
 * @return {object} 400 - input data invalid
 */
 .delete(checkAuth, userController.deleteFriend)

router.route('/friends/:id(\\d+)') 
/**
* GET /api/user/friends/{id}
* @summary To get all user's friends
* @tags User
* @param {number} id.path.required - user's id
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.get(checkAuth,userController.getAllFriends) 

router.route('/friends/posts/:id(\\d+)') 
/**
* GET /api/user/friends/posts/{id}
* @summary To get all posts from all user's friends
* @tags User
* @param {number} id.path.required - user's id
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.get(checkAuth,userController.getAllFriendsPosts) 

router.route('/posts/:id(\\d+)') 
/**
* GET /api/user/posts/{id}
* @summary To get all user's posts
* @tags User
* @param {number} id.path.required - user's id
* @return {object} 200 - success response
* @return {ApiError} 400 - input data invalid
*/
.get(userController.getAllPostsWithPhoto) 

module.exports = router


