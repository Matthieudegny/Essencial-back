const jwt = require('jsonwebtoken')
require('dotenv').config();


function checkLog(req,res,next) {
    let token = req.headers['authorization'];
    if(token == null){
        return res.status(401).send("unauthorized");
    }
    const [, headerToken] = token.split(' ');

    jwt.verify(headerToken, process.env.ACCESS_TOKEN_SECRET, (err,response) => {
        if (err) {
            return res.status(403).send('fordbiden');
        }
        
        next()
    })
}

module.exports = checkLog;

