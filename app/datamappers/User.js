
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
 * @property {timestamptz} date_of_birth - Date of birth
 * @property {string} password - Password
 * @property {string} rights - user's right
 * @property {string} phone_number - Phone number
 * @property {string} address - Address
 * @property {string} region - region
 * @property {string} zip_code - postal code
 * @property {string} city - city
 * @property {timestamptz} created_at - Date of creation
 * @property {timestamptz} updated_at - Date of updated
 * @property {string} path - Path of the profile picture
 */

class User extends CoreDatamapper {
    tableName = 'user'

    async findByEmail(user) {
        // user -> {user.email && user.password}
        let preparedQuery = {}

                preparedQuery = {
                text: `
                SELECT * 
                FROM "${this.tableName}"
                WHERE "email" = $1
                AND "password" = $2`,
                values: [user.email, user.password]
            };

        console.log(preparedQuery.text);
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
        
        const preparedQueryUserId = {
            text: `
            SELECT * FROM "user"
            JOIN "photo" ON "user".id = "photo"."user_id"
            WHERE "user"."id" IN (
                SELECT friend_id 
                    FROM friendship
                    WHERE "user_id" = $1 
                )`,
            values: [userId]
        }

        const preparedQueryFriendId = {
            text:`
            SELECT * FROM "user" 
            JOIN "photo" ON "user".id = "photo"."user_id"
            WHERE "user"."id" IN (
                SELECT user_id 
                    FROM friendship
                    WHERE "friend_id" = $1 
                )`,
            values: [userId]
        }

        let resultUserId = await this.client.query(preparedQueryUserId)
        console.log("result friends req ----->" , resultUserId);
        let resultFriendId = await this.client.query(preparedQueryFriendId)
        if(resultUserId.rowCount > 1){
            resultUserId = resultUserId.rows
        }else{
            resultUserId = resultUserId.rows[0]
        }
        if(resultFriendId.rowCount > 1){
            resultFriendId = resultFriendId.rows
        }else{
            resultFriendId = resultFriendId.rows[0]
        }
        const result = Object.assign({}, resultUserId, resultFriendId);
        return result
    }

    async findAllPostsWithPhoto(userId) {
        const preparedQuery = {
            text:`
            SELECT * FROM "post"
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
}

module.exports = new User(client);