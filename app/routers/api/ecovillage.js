const express = require('express');
const router = express.Router();
const ecovillageController = require('../../controllers/api/ecovillage')
const validator = require('../../validation/validator');
const checkAuth = require('../../middlewares/checkAuth');
const userGetSchema = require('../../validation/schemas/user/userGet.schema');


router.route('/create')
/**
 * POST /api/ecovillage/create
 * @summary To create one eco village
 * @tags Eco Village
 * @param {object} request.body.required - user object with all ecovillage's info + path (photo path)
 * @return {object} 200 - success response
 * @return {object} 400 - input data invalid
 */
.post(ecovillageController.createOneWithPhoto)


module.exports = router