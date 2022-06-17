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
 * @param {object} request.body.required - post to create (content, title, path)
 * @return {object} 200 - success response
 * @return {ApiError} 400 - input data invalid
*/
.post(checkAuth, postController.createOneWithPhoto)

module.exports = router