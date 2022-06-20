const client = require('../db/pg');
const CoreDatamapper = require('./coreDatamapper');
const photoDatamapper = require('./Photo');

class Ecovillage extends CoreDatamapper {
    tableName= "ecovil"

    async findAllWithPhoto(){
        const preparedQuery = {
            text: `
            SELECT "ecovil".*, "photo".path
            FROM "${this.tableName}"
            JOIN "photo" ON "ecovil".id = "photo".ev_id`
        }
        const result = await this.client.query(preparedQuery)
        if (!result.rows[0]) {
            return null;
        }
        return result.rows
    }

    async findOneWithPhoto(ecovilId){

        const preparedQuery = {
            text: `
            SELECT "ecovil".*, "photo".path
            FROM "${this.tableName}"
            JOIN "photo" ON "ecovil".id = "photo".ev_id
            WHERE "ecovil".id = $1`,
            values: [ecovilId]
        }

        const result = await this.client.query(preparedQuery)

        if (!result.rows[0]) {
            return null;
        }

        return result.rows[0];
    }

    async createWithPhoto(ecovil){

        // création d'un user sans la propriété path pour pouvoir l'insérer
        // dans la création d'un user
        const ecovilWithoutPath = JSON.parse(JSON.stringify(ecovil));
        Reflect.deleteProperty(ecovilWithoutPath, 'path')
 
        // insertion d'un user
        const ecovilInsert = await this.create(ecovilWithoutPath);

        if(!ecovilInsert){
            return null;
        }

        const photoInput = {
            ev_id : ecovilInsert.id,
            path: ecovil.path
        }

        // insertion d'une photo
        const photoInsert = await photoDatamapper.create(photoInput)

        if(!photoInsert){
            return null;
        }

        return {
            ecovil: ecovilInsert,
            photo: photoInsert
        }
    }
}

module.exports = new Ecovillage(client);