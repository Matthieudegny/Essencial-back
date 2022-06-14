const userDatamapper = require('../../datamappers/User');
require('dotenv').config();
const jwt = require('jsonwebtoken')

const userController = {

    async getAll(_,res){
        const users = await userDatamapper.findAll()
        try {
            if(!result){
                console.log("je passe dans le if no result");
                throw Error({error: `There is no users on table user`})
            }
            return res.json(users)            
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async getAllWithPhotos(req,res){
        try {
            const users = await userDatamapper.findAllWithPhoto()
            console.log("users ->",users);
            if(!users){
                console.log("on passe dans le if");
                throw new Error({error: "There is no user on BDD"})
            }    
            return res.json(users)
        } catch (error) {
            console.trace(error)
            res.status(400).json({error: error})
        }

    },

    async getOne(req,res){
        const user = req.body
        try {
            if(!user.id){
                throw new Error("You must specify an id")
            }

            const result = await userDatamapper.findByPk();

            if(!result){
                console.log("je passe dans le if no result");
                throw new Error(`There is no user with id: ${user.id}`)
            }

            return res.json(result)

        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async getOneWithPhoto(req,res){
        const user = req.body
        try {
            if(!user.id){
                console.log("je passe dans le if no id");
                throw new Error("You must specify an id")
            }

            const result = await userDatamapper.findOneWithPhoto(user.id)
            console.log(result);
            if(!result){
                console.log("je passe dans le if no result");
                throw new Error(`There is no user with id ${user.id}`)
            }

            return res.json(result)

        }catch(error){
            return res.status(400).json({error: error.message})
        }
    },

    async verifyAuthentification(req,res){
        const user = req.body
        try {
            if(!user.email || !user.password){
                console.log("je passe dans le if no email & password");
                throw Error("you must send user.email & user.password")
            }
            const result = await userDatamapper.findByEmail(user);
    
            if (!result){
                throw Error(`There is no match for email and password`)
            }

            const accessToken = jwt.sign(result, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'})
            console.log("jwt -->",accessToken);
            return res.json({
                    message: "Authentification complete",
                    jwt: accessToken
                    })
            
        } catch(error) {
            return res.status(400).json({error: error.message})
        }
    },

    async createOne(req,res){
        const user = req.body
        try {
            if(!user){
                throw Error("you must send a user")
            }
            const result = await userDatamapper.create(user)
            return res.json(result)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async deleteOne(req,res){
        const userId = req.query.id
        console.log(userId);
        try {
            if(!userId){
                throw Error("you must send user.id")
            }
            const result = await userDatamapper.delete(userId)
            console.log(result);
            return res.json({
                user: result,
                message: "user deleted successfully"
            })
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
}

module.exports = userController