const client = require('../db/pg');
const CoreDatamapper = require('./coreDatamapper');
const photoDatamapper = require('./Photo');
const categoryDatamapper = require('./Category');
class Post extends CoreDatamapper {

    tableName = 'post';

    async findOneWithPhoto(postId){

        const preparedQuery = {
            text: `
            SELECT "post".*, "photo".path
            FROM "${this.tableName}"
            JOIN "photo" ON "post".user_id = "photo".user_id
            WHERE post."user_id" = $1`,
            values: [postId]
        }

        const result = await this.client.query(preparedQuery)

        if(!result.rows[0]) {
            return null
        }

        return result.rows[0]
    }

    async createWithPhotoAndCategory(post){

        // création d'un post sans la propriété path pour pouvoir l'insérer
        // dans la création d'un user
        const postWithoutPathAndCategory = JSON.parse(JSON.stringify(post));
        Reflect.deleteProperty(postWithoutPathAndCategory, 'path');
        Reflect.deleteProperty(postWithoutPathAndCategory, 'category_1');
        if(post.category_2){
            Reflect.deleteProperty(postWithoutPathAndCategory, 'category_2');   
        }

        // insertion d'un post
        const postInsert = await this.create(postWithoutPathAndCategory);

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

       let categoryInsert

        if(!post.category_2){

            const findByName = await categoryDatamapper.findByName(post.category_1)

            const preparedQuery = {
                text: `INSERT INTO "post_has_category"
                        ("post_id", "category_id")
                        VALUES ($1,$2)
                        RETURNING *`,
                values:[postInsert.id, findByName.id]
            }

            categoryInsert = await this.client.query(preparedQuery)
            categoryInsert = categoryInsert.rows[0]

        } else {
            const findByName1 = await categoryDatamapper.findByName(post.category_1)

            const preparedQuery1 = client.query(
                        `INSERT INTO "post_has_category"
                        ("post_id", "category_id")
                        VALUES ($1,$2)
                        RETURNING *`,
                        [postInsert.id, findByName1.id]
            )

            const findByName2 = await categoryDatamapper.findByName(post.category_2)

            const preparedQuery2 = (
                        `INSERT INTO "post_has_category"
                        ("post_id", "category_id")
                        VALUES ($1,$2)
                        RETURNING *`,
                        [postInsert.id, findByName2.id]
            )

            const queries = []
            queries.push(preparedQuery1)
            queries.push(preparedQuery2)

            categoryInsert = await Promise.all(queries)
            categoryInsert = categoryInsert.rows
        }


        return {
            post: postInsert,
            photo: photoInsert,
            post_has_category: categoryInsert,
            message: "post created successfully"
        }
    }
}

module.exports = new Post(client);