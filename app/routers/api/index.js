const express = require('express');
const router = express.Router();
const apiErrorController = require('../../controllers/api/error');
const userRouter = require('./user');
const postRouter = require('./post');


router.use('/user', userRouter)
router.use('/post', postRouter)


router.use(apiErrorController.error404);

module.exports = router;