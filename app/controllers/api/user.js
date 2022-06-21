const userDatamapper = require('../../datamappers/User');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { addFriend } = require('../../datamappers/User');

const userController = {

    async getAll(_,res){
        const users = await userDatamapper.findAll()
        try {
            if(!result){
                return res.json({error: `There is no users on table user`})
            }
            return res.json(users)            
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async getAllWithPhotos(req,res){
        try {
            const users = await userDatamapper.findAllWithPhoto()
            if(!users){
                return res.json({error: `There is no users on table user`})
            }    
            return res.json(users)
        } catch (error) {
            res.status(400).json({error: error})
        }

    },

    async getOne(req,res){
        const userId = req.params.id
        try {
            if(!userId){
                return res.json({mesage: `You must send an identifier`})
            }

            const result = await userDatamapper.findByPk();

            if(!result){
                return result.json({message:`There is no user with id: ${user.id}`})
            }

            return res.json(result)

        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async getOneWithPhoto(req,res){
        const userId = req.params.id
        try {
            if(!userId){
                return res.json({mesage: `You must send an identifier`})
            }

            const result = await userDatamapper.findOneWithPhoto(userId)

            if(!result){
                return result.json({message:`There is no user with id: ${user.id}`})
            }

            return res.json(result)

        }catch(error){
            return res.status(400).json({error: error.message})
        }
    },

    /**
     * User controller to verify Authentification
     * ExpressMiddleware signature
     * @param {object} req Express request object
     * @param {object} res Express response object
     * @return Route API JSON response
     */
    async verifyAuthentification(req,res){
        const user = req.body
        try {
            if(!user.email || !user.password){
                throw Error("you must send user.email & user.password")
            }
            const result = await userDatamapper.findByEmail(user);
            
            if (!result){
                throw Error(`There is no match for email and password`)
            }

            delete result.password
            delete result.phone_number
            delete result.address
            delete result.zip_code
            delete result.city
            delete result.first_name
            delete result.last_name
            delete result.email
            delete result.region
            delete result.date_of_birth
            result.type = "user"

            /* console.log("result --->" , result); */

            const accessToken = jwt.sign(result, process.env.ACCESS_TOKEN_SECRET, {expiresIn: 1800})

            return res.json({
                    logged: true,
                    pseudo: result.pseudo,
                    token: accessToken
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

    async createOneWithPhoto(req,res){
        const user = req.body
        try {
            if(!user){
                throw Error("you must send a user")
            }
            if(!user.path){
                throw Error("you must send a photo")
            }
            const result = await userDatamapper.createWithPhoto(user)
            return res.json(result)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async deleteOne(req,res){
        const userId = req.params.id

        let token = req.headers['authorization']; 
        token = token.slice(4,token.length);
        
        const jwtUserId = jwt.decode(token).id
        const jwtType = jwt.decode(token).type

        try {
            if(!userId){
                throw Error("you must send the identifier")
            }
            if((userId != jwtUserId) || (jwtType !== "user")){
                throw Error("you can't delete a user that is not yours")
            }
            const userToDelete = await userDatamapper.findByPk(userId)
            if(!userToDelete){
                throw Error("The id does not exist")
            }

            const result = await userDatamapper.delete(userId)

            return res.json({
                message: "user deleted successfully"
            })
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async getAllFriends(req, res) {
        const userId = req.params.id

        let token = req.headers['authorization']; 
        token = token.slice(4,token.length);
        
        const jwtUserId = jwt.decode(token).id
        const jwtType = jwt.decode(token).type

        if((userId != jwtUserId) || (jwtType !== "user")){
            return res.json({"message": "you can't find friends that is not yours"})
        }

        const friends = await userDatamapper.findAllFriends(userId)

        if(!friends){
            return res.json({"message": "This user don't have any friend"})
        }

        return res.json(friends)

    },

    async getAllPostsWithPhoto(req, res) {

        const userId = req.params.id

        let token = req.headers['authorization']; 
        token = token.slice(4,token.length);
        
        const jwtUserId = jwt.decode(token).id
        const jwtType = jwt.decode(token).type

        if((userId != jwtUserId) || (jwtType !== "user")){
            return res.json({"message":"you can't find friends that is not yours"})
        }

        const posts = await userDatamapper.findAllPostsWithPhoto(userId)

        return res.json(posts)
    },

    async getAllFriendsPosts (req,res) {

        const userId = req.params.id

        let token = req.headers['authorization']; 
        token = token.slice(4,token.length);
        
        const jwtUserId = jwt.decode(token).id
        const jwtType = jwt.decode(token).type

        if((userId != jwtUserId) || (jwtType !== "user")){
            return res.json({"message":"you can't find friend's posts that is not yours"})
        }

        const allFriends = await userDatamapper.findAllFriends(userId)

        if(!allFriends){
            return res.json({"message":`User with id ${userId} don't have any friend`})
        }

        friendsId = []

        Object.values(allFriends).forEach((friend) => {
            friendsId.push(friend.id)
        })

        const result = await userDatamapper.findAllFriendsPostWithPhoto(friendsId)

        return res.json(result)
    },

    async updateWithPhotoOrNot (req,res){
        const user = req.body
        let token = req.headers['authorization']; 
        token = token.slice(4,token.length);
        
        const userId = jwt.decode(token).id
        const jwtType = jwt.decode(token).type
  
        try {
            if(!user){
                return res.json({"message":"you must send data to update a user"})
            }
            if(jwtType !== "user"){
                return res.json({"message":"you can't update user that is not yours"})
            }
            const result = await userDatamapper.updateWithPhotoOrNot(userId,user)
            return res.json(result)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async addFriend (req,res){
        const friendId = req.params.id
        let token = req.headers['authorization']; 
        token = token.slice(4,token.length);
        const jwtType = jwt.decode(token).type       
        const userId = jwt.decode(token).id

        try {
            if(!friendId){
                throw Error("you must send a friend")
            }
            if(jwtType !== "user"){
                return res.json({"message":"you can't add friends for an other"})
            }
            if(friendId == userId){
                return res.json({"message":"you can't add your own profil on friends"})
            }

            const result = await userDatamapper.addFriend(userId,friendId)
            return res.json({result, "message": "friend add successfully"})
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
}

module.exports = userController