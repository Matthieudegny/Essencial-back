
const client = require('../db/pg');
const CoreDatamapper = require('./coreDatamapper');
const photoDatamapper = require('./Photo');

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
        const userWithoutPath = JSON.parse(JSON.stringify(user)) ;
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
}

module.exports = new User(client);