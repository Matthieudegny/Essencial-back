const postDatamapper = require('../../datamappers/Post');
const jwt = require('jsonwebtoken')
require('dotenv').config();


const postController = {

    async createOneWithPhoto(req,res){
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
            const result = await postDatamapper.createWithPhoto(post)
            console.log("post --->" , post);
            return res.json(result)
        } catch (error) {
            return res.status(400).json({error: error.message})
        }
    }
}

module.exports = postController