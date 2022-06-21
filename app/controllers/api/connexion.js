const ecovillageDatamapper = require('../../datamappers/Ecovillage');
const userDatamapper = require('../../datamappers/User')
require('dotenv').config();
const jwt = require('jsonwebtoken');

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
                    throw Error('There is no match for email and password')
                }

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
                        name: ecovilResult.name,
                        token: accessToken
                        })
            } else {

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
                        pseudo: userResult.pseudo,
                        token: accessToken
                        })
            }

            
        } catch (error) {
            return res.status(400).json({error: error.message})
        }

    }

}

module.exports = connexionController