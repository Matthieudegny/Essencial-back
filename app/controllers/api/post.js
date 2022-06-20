const postDatamapper = require('../../datamappers/Post');
const jwt = require('jsonwebtoken')
require('dotenv').config();


const postController = {

    async getOneWithPhoto(req,res){
        const postId = req.params.id
        try {
            if(!postId){
                throw new Error("You must specify and id")
            }

            const result = await postDatamapper.findOneWithPhoto(postId)

            if(!result){
                throw new Error(`There is no post with id ${postId}`)
            }

            return res.json(result)

        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async getAllTuto(req,res){
        const result = await postDatamapper.findAllTuto()
        if(!result){
            return res.json({"message":"There is no post with category tuto"})
        }
        return res.json(result)
    },

    async createOneWithPhotoAndCategory(req,res){
        const post = req.body
        let token = req.headers['authorization']; 
        token = token.slice(4,token.length);
        
        const userId = jwt.decode(token).id
        post.user_id = userId;

        try {
            if(!post){
                throw Error("you must send a post")
            }
            if(!post.path){
                throw Error("you must send a photo")
            }
            if(!post.category_1){
                throw Error("you must send at least one category")
            }
            const result = await postDatamapper.createWithPhotoAndCategory(post)
            return res.json(result)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    },

    async deleteOne(req, res){
        const postId = req.params.id

        try {
            if(!postId){
                throw Error("you must send the identifier")
            }
            const postToDelete = await postDatamapper.findByPk(postId)
            if(!postToDelete) {
                throw Error("The id does not exist")
            }

            const result = await postDatamapper.delete(postId)

            return res.json({
                message: "post deleted successfully"
            })
            
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
}

module.exports = postController