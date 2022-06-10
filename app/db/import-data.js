const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');
/* const { x } = require('joi'); */

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const { Client } = require('pg');
const { promise } = require('bcrypt/promises');
 const debug = require('debug')('import:log');

faker.locale = 'fr';
const NB_USERS = 50

// ---------- creation users faker ----------

const users = []

for(i=0;i<NB_USERS;i++) {
    const user = {}
    user.email = faker.internet.email(user.first_name, user.last_name);
    if ( i % 2 === 0 ){
        user.first_name = faker.name.firstName('male')
    }else{
        user.first_name = faker.name.firstName('female')
    }
    user.last_name = faker.name.lastName();
    user.pseudo = user.first_name + faker.datatype.number(95)
    user.date_of_birth = faker.date.past(65);
    user.password = "test";
    user.phone_number = faker.phone.phoneNumber('06########');
    user.address = faker.address.streetAddress();
    user.state = faker.address.state();
    user.city = faker.address.city();
    user.zip_code = faker.address.zipCodeByState(`state: ${user.state}`);
    users.push(user);
}

// ---------- creation photo -> user faker ----------

const photos = [];
let randomNumbers = []

for(i=0;i<NB_USERS;i++){

    const photo = {}
    photo.path = faker.image.avatar()
    let randomNumber = faker.datatype.number({min: 1, max:50})
    while(randomNumbers.includes(randomNumber)){
        randomNumber = faker.datatype.number({min: 1, max:50})
    }
    randomNumbers.push(randomNumber)
    photo.user_id = randomNumber;
    photos.push(photo);
}

// ---------- SEEDING ---------- 

(async () => {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        /* ssl: { rejectUnauthorized: false}, */
    });

    await client.connect();

    /* debug('Clean Table') */

   /*  await client.query('TRUNCATE TABLE "user", "photo" RESTART IDENTITY'); */

    const queries = [];

    let count = 0

    users.forEach((user) => {
        count += 1
        debug('insert' , user.first_name , user.last_name + ' on queries array :' + ' ' +  ' / ' + 'request n°' + count );
        const query = client.query(
            `
            INSERT INTO "user"
            ("email","first_name", "last_name","pseudo","date_of_birth", "password", "phone_number", "address","state", "zip_code", "city")
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
            `,
            [user.email, user.first_name, user.last_name, user.pseudo, user.date_of_birth, user.password, user.phone_number, user.address, user.state, user.zip_code, user.city],
            );
            queries.push(query);
        });  

        count = 0

    photos.forEach((photo) => {
        count += 1;
        debug('insert avatar on queries array, user:',photo.user_id + ' / ' + 'request n°' + count );
        const query = client.query(
            `
            INSERT INTO "photo"
            ("path", "user_id")
            VALUES
            ($1, $2)
            RETURNING *
            `,
            [photo.path, photo.user_id],
            );
            queries.push(query);
        });  

        await Promise.all(queries)

        debug('Done');

        client.end()

})()
