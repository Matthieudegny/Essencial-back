const userDatamapper = require('../../datamappers/User');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const { addFriend } = require('../../datamappers/User');

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
            /* console.log("users ->",users); */
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
        const userId = req.params.id
        try {
            if(!userId){
                throw new Error("You must specify an id")
            }

            const result = await userDatamapper.findOneWithPhoto(userId)

            if(!result){
                throw new Error(`There is no user with id ${userId}`)
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
        console.log("user ------>", user);
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

        try {
            if(!userId){
                throw Error("you must send the identifier")
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

        const checkUserExist = await userDatamapper.findByPk(userId)
        if(!checkUserExist){
            throw Error("User with id does not exist")
        }
        const friends = await userDatamapper.findAllFriends(userId)

        return res.json(friends)

    },

    async getAllPostsWithPhoto(req, res) {

        const userId = req.params.id

        const checkUserExist = await userDatamapper.findByPk(userId)
        if(!checkUserExist){
            throw Error("User with id does not exist")
        }
        const posts = await userDatamapper.findAllPostsWithPhoto(userId)

        return res.json(posts)
    },

    async getAllFriendsPosts (req,res) {
        const userId = req.params.id
        const allFriends = await userDatamapper.findAllFriends(userId)

        if(!allFriends){
            throw Error(`User with id ${userId} don't have any friend`)
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
  
        try {
            if(!user){
                throw Error("you must send a user")
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
        
        const userId = jwt.decode(token).id

        try {
            if(!friendId){
                throw Error("you must send a friend")
            }
            const result = await userDatamapper.addFriend(userId,friendId)
            return res.json({result, "message": "friend add successfully"})
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
}

module.exports = userController