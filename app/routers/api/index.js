const express = require('express');
const router = express.Router();
const apiErrorController = require('../../controllers/api/error');
const userRouter = require('./user');
const postRouter = require('./post');
const ecovillageRouter = require('./ecovillage')


router.use('/user', userRouter)
router.use('/post', postRouter)
router.use('/ecovillage', ecovillageRouter)


router.use(apiErrorController.error404);

module.exports = router;