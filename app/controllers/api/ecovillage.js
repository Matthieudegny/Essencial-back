const ecovillageDatamapper = require('../../datamappers/Ecovillage');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const ecovillageController = {

    async getAllWithPhotos(req,res){
        try {
            const ecovils = await ecovillageDatamapper.findAllWithPhoto()
            if(!ecovils){
                throw new Error({error: "There is no ecovillage on BDD"})
            }    
            return res.json(ecovils)
        } catch (error) {
            res.status(400).json({error: error})
        }

    },

    async getOneWithPhoto(req,res){
        const ecovilId = req.params.id
        try {
            if(!ecovilId){
                throw new Error("You must specify an id")
            }

            const result = await ecovillageDatamapper.findOneWithPhoto(ecovilId)

            if(!result){
                throw new Error(`There is no ecovillage with id ${ecovilId}`)
            }

            return res.json(result)

        }catch(error){
            return res.status(400).json({error: error.message})
        }
    },

    async createOneWithPhoto(req,res) {
        const ecovil = req.body
        try {
            if(!ecovil){
                throw Error("you must send an ecovillage")
            }
            if(!ecovil.path){
                throw Error("you must send a photo")
            }
            const result = await ecovillageDatamapper.createWithPhoto(ecovil)
            return res.json(result)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async deleteOne(req,res){
        const ecovilId = req.params.id

        try {
            if(!ecovilId){
                throw Error("you must send the identifier")
            }
            const ecovillageToDelete = await ecovillageDatamapper.findByPk(ecovilId)
            if(!ecovillageToDelete){
                throw Error("The id does not exist")
            }

            const result = await ecovillageDatamapper.delete(ecovilId)
            return res.json({
                message: "ecovillage deleted successfully"
            })
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

}

module.exports = ecovillageController