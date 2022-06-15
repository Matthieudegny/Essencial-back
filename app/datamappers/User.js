
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

}

module.exports = new User(client);