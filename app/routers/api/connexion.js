const express = require('express');
const router = express.Router();
const connexionController = require('../../controllers/api/connexion');
const validator = require('../../validation/validator');

router.route('/')
/**
 * POST /api/connexion
 * @summary To connect a user or ecovillage profile
 * @tags Connexion
 * @param {object} request.body.required - user or ecovillage object with only email and password 
 * @return {object} 200 - success response
 * @return {ApiError} 400 - input data invalid
*/
.post(connexionController.verifyAuthentification)

module.exports = router;