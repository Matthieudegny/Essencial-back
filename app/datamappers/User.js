
const client = require('../db/pg');
const CoreDatamapper = require('./coreDatamapper');
const photoDatamapper = require('./Photo');

/**
 * @typedef {object} User
 * @property {number} id - Identifier unique primary key of the table
 * @property {string} email - Email unique 
 * @property {string} first_name - First name
 * @property {string} last_name - Last name
 * @property {string} pseudo - Pseudo
 * @property {string} date_of_birth - Date of birth
 * @property {string} password - Password
 * @property {string} rights - user's right
 * @property {string} phone_number - Phone number
 * @property {string} address - Address
 * @property {string} region - region
 * @property {string} zip_code - postal code
 * @property {string} city - city
 * @property {string} created_at - Date of creation
 * @property {string} updated_at - Date of updated
 * @property {string} path - Path of the profile picture
 */

class User extends CoreDatamapper {
    tableName = 'user'

    async findByEmail(user) {
        // user -> {user.email && user.password}

        const preparedQuery = {
                text: `
                SELECT * 
                FROM "${this.tableName}"
                WHERE "user"."email" = $1
                AND "user"."password" = $2`,
                values: [user.email, user.password]
            };

        const result = await this.client.query(preparedQuery);

        if (!result.rows[0]) {
            return null;
        }
        console.log(result.rows[0])
        return result.rows[0];
    }

    async findAllWithPhoto(){
        const preparedQuery = {
            text: `
            SELECT "user".*, "photo".path
            FROM "${this.tableName}"
            JOIN "photo" ON "user".id = "photo".user_id`
        }
        console.log("avant result");
        const result = await this.client.query(preparedQuery)
        console.log("après", result);
        if (!result.rows[0]) {
            return null;
        }
        return result.rows
    }

    async findOneWithPhoto(userId){

        const preparedQuery = {
            text: `
            SELECT "user".*, "photo".path
            FROM "${this.tableName}"
            JOIN "photo" ON "user".id = "photo".user_id
            WHERE "user".id = $1`,
            values: [userId]
        }

        const result = await this.client.query(preparedQuery)

        if (!result.rows[0]) {
            return null;
        }

        return result.rows[0];
    }

    async createWithPhoto(user){

        // création d'un user sans la propriété path pour pouvoir l'insérer
        // dans la création d'un user
        const userWithoutPath = JSON.parse(JSON.stringify(user));
        Reflect.deleteProperty(userWithoutPath, 'path')
 
        // insertion d'un user
        const userInsert = await this.create(userWithoutPath);

        if(!userInsert){
            return null;
        }

        const photoInput = {
            user_id : userInsert.id,
            path: user.path
        }

        // insertion d'une photo
        const photoInsert = await photoDatamapper.create(photoInput)

        if(!photoInsert){
            return null;
        }

        return {
            user: userInsert,
            photo: photoInsert
        }
    }

    async findAllFriends(userId) {

        const preparedQuery = {
            text: `
            SELECT * FROM "user"
            JOIN "photo" ON "user".id = "photo"."user_id"
            WHERE "user"."id" IN (
                SELECT friend_id 
                    FROM friendship
                    WHERE "user_id" = $1 
                )
            UNION
            SELECT * FROM "user" 
            JOIN "photo" ON "user".id = "photo"."user_id"
            WHERE "user"."id" IN (
            SELECT user_id 
                FROM friendship
                WHERE "friend_id" = $1 
                )
                `,
            values: [userId]
        }

        let result = await client.query(preparedQuery)

        if(result.rowCount > 1){
            result = result.rows
        }else{
            result = result.rows[0]
        }
        return result
    }

    async findAllPostsWithPhoto(userId) {
        const preparedQuery = {
            text:`
            SELECT post.id, post.user_id, post.title, post.content FROM "post"
            JOIN "photo" ON photo."user_id" = "post".user_id
            WHERE "post"."user_id" = $1`,
            values: [userId]
        }

        let result = await this.client.query(preparedQuery)

        if(result.rowCount > 1){
            result = result.rows
        }else {
            result = result.rows[0]
        }
        return result
    }

    async findAllFriendsPostWithPhoto(friendsId) {

        const NB_PARAMETERS = friendsId.length
        let indexPlaceholders = ""

        for(let i=0;i<NB_PARAMETERS; i++) {
            let j
            if(i === NB_PARAMETERS - 1) {
                j = `$${i+1}`
            }else {
                j = `$${i+1} ,`
            }
            indexPlaceholders += j
        }

        const preparedQuery = {
            text: `SELECT "post".*, photo.path FROM "post"
                    JOIN "photo" ON "photo"."post_id" = "post"."id"
                    WHERE "post"."user_id" IN (${indexPlaceholders})`, values: friendsId
                } 
                
        console.log("preparedQuery --->" , preparedQuery);

        let result = await this.client.query(preparedQuery)


        if(result.rowCount > 1){
            result = result.rows
        }else {
            result = result.rows[0]
        }

        return result
                                                                      
    }

    async updateWithPhotoOrNot(userId, inputData){

        if(inputData.path){
            const inputDataWithoutPath = JSON.parse(JSON.stringify(inputData));
            Reflect.deleteProperty(inputDataWithoutPath, "path");
            console.log("je passe au dessus de user result");
            const userResult = await this.update(userId,inputDataWithoutPath);
            console.log("je passe en dessous de userResult");
            const preparedQuery = {
                text: `UPDATE "photo" SET
                path = $1,
                updated_at = now()
                WHERE "user_id" = $2
                RETURNING *`,
                values: [inputData.path, userId]
            }
            const photoResult = await this.client.query(preparedQuery);

            const result = {
                user: userResult,
                photo: photoResult.rows[0]
            }

            return result

        }else{

            const result = await this.update(userId, inputData);
            return result
        }
        

    }

    async addFriend (userId, friendId){

        const preparedQuery = {
            text:`INSERT INTO "friendship" ("user_id","friend_id")
                  VALUES ($1,$2)`,
            values: [userId, friendId]
        }

        const newFriendship = await this.client.query(preparedQuery)

        if(!newFriendship){
            return null
        }

        return 
    }
}

module.exports = new User(client);