const express = require('express');

const websiteController = require('../../controllers/website');
/* const { ApiError } = require('../../helpers/errorHandler'); */
/* const controllerHandler = require('../../helpers/controllerHandler');
 */
const router = express.Router();

/* router.use((_, res, next) => {
    // On défini le content-type de la réponse en html pour détection de format d'erreur
    res.type('html');
    next();
}); */

router.get('/', websiteController.homePage);
/* router.get('/', controllerHandler(websiteController.home)); */

/* router.use(() => {
    throw new ApiError('Page introuvable', { statusCode: 404 });
}); */

module.exports = router;
