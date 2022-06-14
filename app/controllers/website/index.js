module.exports = {
    /**
     * Home controller which display documentation link.
     * ExpressMiddleware signature
     * @param {object} _ Express request object (not used)
     * @param {object} res Express response object
     * @returns Route API JSON response
     */

    homePage(_, response) {
        response.render('home', { title: "Essencial"});
    },

};