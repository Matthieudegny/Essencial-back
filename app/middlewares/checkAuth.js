const jwt = require('jsonwebtoken')
require('dotenv').config();
const { verifyAuthentification } = require('../controllers/api/user')

/* const authorizationMiddleware = jwt({ secret: process.env.ACCESS_TOKEN_SECRET, algorithms: ['HS256'] });
 */

function checkLog(req,res,next) {
    const user = req.body;
    const userVerified = verifyAuthentification(user)

    if(userVerified){
        const jwtContent = { userId: userVerified.id };
        const jwtOptions = { 
            algorithm: 'HS256', 
            expiresIn: '3h' 
        }
        console.log('<< 200', userVerified.first_name, userVerified.last_name);
        res.json({
            logged: true,
            pseudo: userVerified.pseudo,
            token: jsonwebtoken.sign(jwtContent, process.env.ACCESS_TOKEN_SECRET, jwtOptions)
        })
        next();
    } else {
        console.log('<< 401 UNHAUTHORIZED');
        res.sendStatus(401);
    }
}

module.exports = checkLog;

