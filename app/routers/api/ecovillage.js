const express = require('express');
const router = express.Router();
const ecovillageController = require('../../controllers/api/ecovillage')
const validator = require('../../validation/validator');
const checkAuth = require('../../middlewares/checkAuth');


router.route('/')
/**
 * GET /api/ecovillage
 * @summary To get all ecovillage with their photos
 * @tags Eco Village
 * @return {Object} 200 - success response
 * @return {object} 400 - input data invalid
 */
.get(ecovillageController.getAllWithPhotos)

router.route('/connexion')
/**
* POST /api/ecovillage/connexion
* @summary To verified if email match with password
* @tags Eco Village
* @param  {object} request.body.required - ecovillage's object with only email and password
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.post(ecovillageController.verifyAuthentification) 

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
* DELETE /api/ecovillage/{id}
* @summary To delete one ecovillage with his photo
* @tags Eco Village
* @param {number} id.path.required - ecovillage's id
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.delete(ecovillageController.deleteOne)

/**
* patch /api/ecovillage/{id}
* @summary To update one ecovillage 
* @tags Eco Village
* @param {object} request.body.required - ecovillage's data to update
* @return {object} 200 - success response
* @return {object} 400 - input data invalid
*/
.patch(ecovillageController.updateWithPhotoOrNot) 

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