const client = require('../db/pg');
const CoreDatamapper = require('./coreDatamapper');
const photoDatamapper = require('./Photo');

class Ecovillage extends CoreDatamapper {
    tableName= "ecovil"

    async findByEmail(ecovil) {

        const preparedQuery = {
                text: `
                SELECT * 
                FROM "${this.tableName}"
                WHERE "ecovil"."email" = $1
                AND "ecovil"."password" = $2`,
                values: [ecovil.email, ecovil.password]
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

        // création d'un ecovillage sans la propriété path pour pouvoir l'insérer
        // dans la création d'un ecovillage
        const ecovilWithoutPath = JSON.parse(JSON.stringify(ecovil));
        Reflect.deleteProperty(ecovilWithoutPath, 'path')
 
        // insertion d'un ecovillage
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

    async updateWithPhotoOrNot(ecovilId, inputData){

        if(inputData.path){
            const inputDataWithoutPath = JSON.parse(JSON.stringify(inputData));
            Reflect.deleteProperty(inputDataWithoutPath, "path");
            const ecovilResult = await this.update(ecovilId,inputDataWithoutPath);
            const preparedQuery = {
                text: `UPDATE "photo" SET
                path = $1,
                updated_at = now()
                WHERE "ev_id" = $2
                RETURNING *`,
                values: [inputData.path, ecovilId]
            }
            const photoResult = await this.client.query(preparedQuery);

            const result = {
                ecovillage: ecovilResult,
                photo: photoResult.rows[0]
            }

            return result

        }else{

            const result = await this.update(ecovilId, inputData);
            return result
        }
        

    }
}

module.exports = new Ecovillage(client);