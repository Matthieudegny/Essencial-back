const jwt = require('jsonwebtoken')
require('dotenv').config();
const { verifyAuthentification } = require('../controllers/api/user')

/* const authorizationMiddleware = jwt({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'] });
 */

function checkLog(req,res,next) {

    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null){
        return res.sendStatus(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,res) => {
        console.log(err);
        if (err) {
            return res.sendStatus(403)
        }
        req.user = user
        next()
    })

}

module.exports = checkLog;

