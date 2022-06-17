const client = require('../db/pg');
const CoreDatamapper = require('./coreDatamapper');
const photoDatamapper = require('./Photo');

class Post extends CoreDatamapper {

    tableName = 'post';

    async createWithPhoto(post){

        // création d'un post sans la propriété path pour pouvoir l'insérer
        // dans la création d'un user
        const postWithoutPath = JSON.parse(JSON.stringify(post));
        Reflect.deleteProperty(postWithoutPath, 'path');
        console.log("postWithoutPath --->", postWithoutPath);

        // insertion d'un post
        const postInsert = await this.create(postWithoutPath);

        if(!postInsert){
            return null;
        }

        const photoInput = {
            post_id : postInsert.id,
            path: post.path
        }

        // insertion d'une photo
        const photoInsert = await photoDatamapper.create(photoInput)

        if(!photoInsert){
            return null;
        }

        return {
            post: postInsert,
            photo: photoInsert
        }
    }
}

module.exports = new Post(client);