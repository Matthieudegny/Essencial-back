const ecovilDatamapper = require('../../datamappers/Ecovillage');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const ecovillageController = {

    async createOneWithPhoto(req,res) {
        const ecovil = req.body
        try {
            if(!ecovil){
                throw Error("you must send an ecovillage")
            }
            if(!ecovil.path){
                throw Error("you must send a photo")
            }
            const result = await ecovilDatamapper.createWithPhoto(ecovil)
            return res.json(result)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }

}

module.exports = ecovillageController