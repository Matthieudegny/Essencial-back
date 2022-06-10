const client = require('../db/pg');
const CoreDatamapper = require('./coreDatamapper');

class User extends CoreDatamapper {
    tableName = 'user'

    async findByEmail(user) {
        let preparedQuery = {}
        // Si on fournis un mdp à l'objet user on l'ajoute à la requête
        // Sinon on ne cherche que par rapport à l'adresse mail
        if(user.password){
                preparedQuery = {
                text: `
                SELECT * 
                FROM "${this.tableName}"
                WHERE "email" = $1
                AND "password" = $2`,
                values: [user.email, user.password]
            };
        } else {
                preparedQuery = {
                text: `
                SELECT * 
                FROM "${this.tableName}"
                WHERE "email" = $1`,
                values: [user.email]
            };
        }

        const result = await this.client.query(preparedQuery);

        if (!result.rows[0]) {
            // Si il n'y à pas de résultat je lève une erreur en fonction de ce qui à été
            // fournis dans l'objet user
            if (!user.email){
                throw new Error('method findByEmail must have user.email as parameter')
            } else if (user.email && !user.password){
                throw new Error(`${user.email} is not referenced in the bdd`)
            } else {
                throw new Error(`the email ${user.email} does not match with password ${user.password} (on table ${table}) `);
            }
        }
        return result.rows[0];
    }

}

module.exports = new User(client);