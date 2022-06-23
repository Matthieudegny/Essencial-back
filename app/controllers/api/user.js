const userDatamapper = require('../../datamappers/User');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { ApiError } = require('../../helpers/errorHandler');

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
                return result.json({message:`There is no user with id: ${userId}`})
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
                return result.json({message:`There is no user with id: ${userId}`})
                /* throw new ApiError(`There is no user with id ${user.id}`, { statusCode: 404 }); */
            }

            return res.json(result)

        }catch(error){
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
        
        const salt = bcrypt.genSaltSync(parseInt(process.env.HASH_SALT_ROUNDS));
        const hash = bcrypt.hashSync(user.password, salt);

        user.password = hash

        try {
            if(!user){
                throw Error("you must send a user")
            }
            if(!user.path){
                throw Error("you must send a photo")
            }
            const result = await userDatamapper.createWithPhoto(user)
            delete result.user.password
            console.log(result);
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
                throw Error("you must send data to update a user")
            }
            if(jwtType !== "user"){
                throw Error("you can't update user that is not yours")
            }
            const result = await userDatamapper.updateWithPhotoOrNot(userId,user)
            delete result.password
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
                throw Error("you can't add friends for an other")
            }
            if(friendId == userId){
                throw Error("you can't add your own profil on friends")
            }

            const result = await userDatamapper.addFriend(userId,friendId)
            return res.json({result, "message": "friend add successfully"})
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async deleteFriend(req,res){
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
                throw Error("you can't remove friends for an other")
            }
            if(friendId == userId){
                throw Error("you can't add your own profil on friends")
            }

            const result = await userDatamapper.deleteFriend(userId,friendId)

            if(!result){
                throw Error("this relation does not exist")
            }
            return res.json({result, "message": "friend deleted successfully"})
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
}

module.exports = userController