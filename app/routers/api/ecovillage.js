const express = require('express');
const router = express.Router();
const ecovillageController = require('../../controllers/api/ecovillage')
const validator = require('../../validation/validator');
const checkAuth = require('../../middlewares/checkAuth');


router.route('/')
/**
 * GET /api/user
 * @summary To get all ecovillage with their photos
 * @tags Eco Village
 * @return {User} 200 - success response
 * @return {object} 400 - input data invalid
 */
.get(ecovillageController.getAllWithPhotos)

router.route('/:id(\\d+)')
/**
 * GET /api/ecovillage/{id}
 * @summary To find an ecovillage with his photo
 * @tags Eco Village
 * @param {number} id.path.required - ecovillage's id 
 * @return {object} 200 - success response
 * @return {ApiError} 400 - input data invalid
*/
.get(checkAuth, ecovillageController.getOneWithPhoto)

/**
* DELETE /api/user/{id}
* @summary To delete one ecovillage with his photo
* @tags Eco Village
* @param {number} id.path.required - ecovillage's id
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.delete(ecovillageController.deleteOne)

router.route('/create')
/**
 * POST /api/ecovillage/create
 * @summary To create one eco village
 * @tags Eco Village
 * @param {object} request.body.required - ecovillage object with all ecovillage's info + path (photo path)
 * @return {object} 200 - success response
 * @return {object} 400 - input data invalid
 */
.post(ecovillageController.createOneWithPhoto)


module.exports = router