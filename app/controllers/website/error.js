module.exports = {

    error404(_, response) {
        response.status(404).render('error', { status: 404, message: 'Page not found' });
    },

};