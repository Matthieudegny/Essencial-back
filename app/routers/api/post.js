const express = require('express');
const router = express.Router();
const postController = require('../../controllers/api/post')
const validator = require('../../validation/validator');
const checkAuth = require('../../middlewares/checkAuth');

router.route('/create')
/**
 * POST /api/post/create
 * @summary To create a new post
 * @tags Post
 * @param {Post} request.body.required - post to create (content, title, path)
 * @return {object} 200 - success response
 * @return {ApiError} 400 - input data invalid
*/
.post(checkAuth, postController.createOneWithPhotoAndCategory)

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
.get(checkAuth, postController.getOneWithPhoto)
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