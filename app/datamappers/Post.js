const client = require('../db/pg');
const CoreDatamapper = require('./coreDatamapper');
const photoDatamapper = require('./Photo');
const categoryDatamapper = require('./Category');

/**
 * @typedef {object} Post
 * @summary Object to create a Post
 * @property {string} content - Content 
 * @property {string} title - Title
 * @property {string} path - Path of the picture
 * @property {string} category_1 - First categorie
 * @property {string} category_2 - Second categorie
 */

class Post extends CoreDatamapper {

    tableName = 'post';

    async findAllWithPhotoAndCategory(){

        const preparedQuery = {
            text: `SELECT  "post".id AS post_id,
                           "post".user_id AS author_id,
                           "post".content AS post_content,
                           "post".title AS post_title,
                           "photo".id AS photo_id,
                           "photo".path AS photo_path,
                           array_agg(category."name") AS categories_name
                    FROM "post"
                    JOIN "photo" ON "photo"."post_id" = "post".id
                    JOIN "post_has_category" ON "post_has_category"."post_id" = "post".id
                    JOIN "category" ON  post_has_category.category_id = category."id"
                    GROUP BY post.id , photo.id`
        }
        const result = await this.client.query(preparedQuery)
        if (!result.rows[0]) {
            return null;
        }
        return result.rows
    }

    async findOneWithPhotoAndCategory(postId){

        const preparedQuery = {
            text: `SELECT "post".id,
            "post".user_id AS author_id,
            "post".content AS post_content,
            "post".title AS post_title,
            "photo".id AS photo_id,
            "photo".path AS photo_path, 
            array_agg(category."name") AS categories_name
            FROM "post"
            JOIN "photo" ON "photo"."post_id" = "post".id
            JOIN "post_has_category" ON "post_has_category"."post_id" = "post".id
            JOIN "category" ON  post_has_category.category_id = category."id"
            WHERE post."id" = $1
            GROUP BY post.id , photo.id`,
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
        /* Reflect.deleteProperty(postWithoutPathAndCategory, 'path'); */
        delete postWithoutPathAndCategory.path
        /* Reflect.deleteProperty(postWithoutPathAndCategory, 'category_1'); */
        delete postWithoutPathAndCategory.category_1
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

        // insertion d'une catégorie

       let categoryInsert

        if(!post.category_2 || (post.category_1 === post.category_2)){

            const findByName = await categoryDatamapper.findByName(post.category_1)
            
            const preparedQuery = {
                text: `INSERT INTO "post_has_category"
                        ("post_id", "category_id")
                        VALUES ($1,$2)
                        RETURNING *`,
                values:[postInsert.id, findByName.id]
            }

            categoryInsert = await this.client.query(preparedQuery)

            return {
                post: postInsert,
                photo: photoInsert,
                category: {
                    ...categoryInsert.rows[0],
                    name: post.category_1
                },
                message: "post created successfully"
            }

        } else {
  
            const findByName1 = await categoryDatamapper.findByName(post.category_1)

            const preparedQuery1 = {
                        text: `INSERT INTO "post_has_category"
                        ("post_id", "category_id")
                        VALUES ($1,$2)
                        RETURNING *`,
                        values: [postInsert.id, findByName1.id]
            }

            const findByName2 = await categoryDatamapper.findByName(post.category_2)

            const preparedQuery2 = {
                        text: `INSERT INTO "post_has_category"
                        ("post_id", "category_id")
                        VALUES ($1,$2)
                        RETURNING *`,
                        values: [postInsert.id, findByName2.id]
            }

            const result1 = await this.client.query(preparedQuery1)
            
            const result2 = await this.client.query(preparedQuery2)

            return {
                post: postInsert,
                photo: photoInsert,
                category1: {
                    ...result1.rows[0],
                    name: post.category_1
                },
                category2: {
                    ...result2.rows[0],
                    name: post.category_2
                },
                message: "post created successfully"
            }
        }


    }

    async findAllTuto(){
        // l'id 1 dans la table category correspond à tuto
        const preparedQuery = {
            text: `SELECT "post".id AS post_id,
                          "post".user_id AS author_id,
                          "post".content AS post_content,
                          "post".title AS post_title,
                          "photo".id AS photo_id,
                          "photo".path AS photo_path 
                          FROM "post" 
                    JOIN "photo" ON "photo"."post_id" = "post".id
                    WHERE "post"."id" IN (
                    SELECT post_id FROM "post_has_category" WHERE category_id = $1
                    )`,
            values: [1]
        }
        const result = await this.client.query(preparedQuery)

        if(!result.rows) {
            return null
        }
        if(result.rowCount > 1) {
            return result.rows
        }else{
            return result.rows[0]
        }
    }

}

module.exports = new Post(client);