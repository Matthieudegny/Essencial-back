const express = require('express');
const router = express.Router();
const postController = require('../../controllers/api/post')
const validate = require('../../validation/validator');
const postCreateSchema = require('../../validation/schemas/post/postCreate.schema')
/* const postUpdateSchema = require('../../validation/schemas/post/postUpdate.schema') */
const checkAuth = require('../../middlewares/checkAuth');


router.route('/')
/**
 * GET /api/post
 * @summary To get all posts
 * @return {object} 200 - success response
 * @return {ApiError} 400 - input data invalid
*/
.get(postController.getAllWithPhotoAndCategory)

router.route('/create')
/**
 * POST /api/post/create
 * @summary To create a new post
 * @tags Post
 * @param {Post} request.body.required - post to create (content, title, path)
 * @return {object} 200 - success response
 * @return {ApiError} 400 - input data invalid
*/
.post(checkAuth, validate('body', postCreateSchema), postController.createOneWithPhotoAndCategory)

router.route('/tuto')
/**
 * GET /api/post/tuto
 * @summary To find all tutorials
 * @tags Post
 * @return {object} 200 - success response
 * @return {ApiError} 400 - input data invalid
 */
 .get(postController.getAllTuto)

router.route('/:id(\\d+)')
/**
 * GET /api/post/{id}
 * @summary To find a post with his photo
 * @tags Post
 * @param {number} id.path.required - post's id 
 * @return {object} 200 - success response
 * @return {ApiError} 400 - input data invalid
*/
.get(checkAuth, postController.getOneWithPhotoAndCategory)
/**
 * DELETE /api/post/{id}
 * @summary To delete a post
 * @tags Post
 * @param {number} id.path.required - post's id
 * @return {object} 200 - success response
 * @return {ApiError} 400 - input data invalid
*/
.delete(checkAuth, postController.deleteOne)


module.exports = router