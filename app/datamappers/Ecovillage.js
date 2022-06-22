const client = require('../db/pg');
const CoreDatamapper = require('./coreDatamapper');
const photoDatamapper = require('./Photo');
const userDatamapper = require('./User');

class Ecovillage extends CoreDatamapper {
    tableName= "ecovil"

    async findByEmail(ecovil) {

        const preparedQuery = {
                text: `
                SELECT * 
                FROM "${this.tableName}"
                WHERE "ecovil"."email" = $1`,
                values: [ecovil.email]
            };

        const result = await this.client.query(preparedQuery);

        if (!result.rows[0]) {
            return null;
        }
        return result.rows[0];
    }

    async findAllWithPhoto(){
        const preparedQuery = {
            text: `SELECT "ecovil".id,
                   "ecovil".email,
                   "ecovil".name,
                   "ecovil".description,
                   "ecovil".address,
                   "ecovil".zip_code,
                   "ecovil".city,
                   "ecovil".region,
                   "ecovil".first_name_manager,
                   "ecovil".last_name_manager,
                   "ecovil".date_of_birth_manager,
                   "ecovil".phone_number,
                   "ecovil".website,
                   "photo".path
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

        // vérification si l'email n'éxiste pas dans user

        const preparedQueryCheckUser =  {               
            text: `SELECT "user".email 
            FROM "user"
            WHERE "user"."email" = $1`,
            values: [ecovil.email]
        }
    
        const resultCheckUser = await this.client.query(preparedQueryCheckUser)

        if(resultCheckUser.rows[0]){
            throw Error("This email already been used")
        }
 
        // insertion d'un ecovillage
        const ecovilInsert = await this.create(ecovilWithoutPath);

        if(!ecovilInsert){
            return null;
        }

        delete ecovilInsert.password

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