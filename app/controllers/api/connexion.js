const ecovillageDatamapper = require('../../datamappers/Ecovillage');
const userDatamapper = require('../../datamappers/User')
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

/**
 * @typedef {object} Connexion
 * @summary Object to send to connect a user or an ecovillage
 * @property {string} email - Identifier unique primary key of the table
 * @property {string} password - Password 
 */

const connexionController = {

    async verifyAuthentification(req,res){

        const userOrEcovil = req.body

        try {
            if(!userOrEcovil.email || !userOrEcovil.password){
                throw Error("you must send an email and a password")
            }
            const userResult = await userDatamapper.findByEmail(userOrEcovil)

            if(!userResult){
                const ecovilResult = await ecovillageDatamapper.findByEmail(userOrEcovil)
                if(!ecovilResult){
                    throw Error('Invalid email or password')
                }
                bcrypt.compare(userOrEcovil.password, ecovilResult.password)
                .then(function(result){
                    if(result == true){
                        delete ecovilResult.email
                        delete ecovilResult.description
                        delete ecovilResult.address
                        delete ecovilResult.zip_code
                        delete ecovilResult.city
                        delete ecovilResult.first_name_manager
                        delete ecovilResult.last_name_manager
                        delete ecovilResult.date_of_birth_manager
                        delete ecovilResult.password
                        delete ecovilResult.phone_number
                        delete ecovilResult.website
                        ecovilResult.type = "ecovillage"
        
                        const accessToken = jwt.sign(ecovilResult, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600})
            
                        return res.json({
                                logged: true,
                                id: ecovilResult.id,
                                name: ecovilResult.name,
                                token: accessToken
                                })

                    }else{
                        return res.status(400).json({error: "Invalid email or password"})
                    }
                })


            } else {
                bcrypt.compare(userOrEcovil.password, userResult.password)
                .then(function(result) {
                    if(result == true){
                        delete userResult.password
                        delete userResult.phone_number
                        delete userResult.address
                        delete userResult.zip_code
                        delete userResult.city
                        delete userResult.first_name
                        delete userResult.last_name
                        delete userResult.email
                        delete userResult.region
                        delete userResult.date_of_birth
                        userResult.type = "user"
        
                        const accessToken = jwt.sign(userResult, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600})
        
                        return res.json({
                                logged: true,
                                id: userResult.id,
                                pseudo: userResult.pseudo,
                                token: accessToken
                                })
                    }else{
                        return res.status(400).json({error: "Invalid email or password"})
                    }
                });
            }   
        } catch (error) {
            return res.status(400).json({error: error.message})
        }

    }

}

module.exports = connexionController