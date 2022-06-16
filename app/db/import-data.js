const dotenv = require('dotenv');
const { faker } = require('@faker-js/faker');

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
}

const { Client } = require('pg');
const { promise } = require('bcrypt/promises');
const debug = require('debug')('import:log');

faker.locale = 'fr';
const NB_USERS = 50;
const NB_FRIENDSHIP = 500;
const NB_POSTS = 1000;

// ---------- creation users faker ----------

const users = []

for(i=0;i<NB_USERS;i++) {
    const user = {}
    if ( i % 2 === 0 ){
        user.first_name = faker.name.firstName('male')
    }else{
        user.first_name = faker.name.firstName('female')
    }
    user.last_name = faker.name.lastName();
    user.email = faker.internet.email(user.first_name, user.last_name);
    user.pseudo = user.first_name + faker.datatype.number(95)
    user.date_of_birth = faker.date.past(65);
    user.password = "test";
    user.phone_number = faker.phone.phoneNumber('06########');
    user.address = faker.address.streetAddress();
    user.region = faker.address.state();
    user.city = faker.address.city();
    user.zip_code = faker.address.zipCodeByState(`state: ${user.state}`);
    users.push(user);
}

// ---------- creation photo -> user faker ----------

const userPhotos = [];
let userPhotoRandomNumbers = []

for(i=0;i<NB_USERS;i++){

    const photo = {}
    photo.path = faker.image.avatar()
    let userPhotoRandomNumber = faker.datatype.number({min: 1, max:NB_USERS})
    while(userPhotoRandomNumbers.includes(userPhotoRandomNumber)){
        userPhotoRandomNumber = faker.datatype.number({min: 1, max:NB_USERS})
    }
    userPhotoRandomNumbers.push(userPhotoRandomNumber)
    photo.user_id = userPhotoRandomNumber;
    userPhotos.push(photo);
}

// ---------- creation friendship ----------

const friendships = [];

for(i=0;i<NB_FRIENDSHIP;i++){

    const friendship = {}
    friendship.user_id = faker.datatype.number({min: 1, max:50})
    friendship.friend_id = faker.datatype.number({min: 1, max:50})
    friendships.forEach(({user_id,friend_id}) => {
        while((friendship.user_id === user_id  && 
            friendship.friend_id === friend_id)||
           (friendship.user_id === friend_id && 
            friendship.friend_id === user_id) ||
            (friendship.user_id === friendship.friend_id)){
                friendship.user_id = faker.datatype.number({min: 1, max:50})
                friendship.friend_id = faker.datatype.number({min: 1, max:50})
            }
    })

    friendships.push(friendship)
} 

// ---------- creation post ---------

const posts = [];

for(i=0 ; i<NB_POSTS ; i++) {
    const post = {}
    post.user_id = faker.datatype.number({min: 1, max:50})
    post.content =  faker.lorem.paragraphs(5)
    if(i % 2 === 0){
        post.title = faker.lorem.words(3)
    } else {
        post.title = faker.lorem.words(2)        
    }

    posts.push(post);
}

// ---------- creation photo -> post faker ----------

const postPhotos = [];
let postPhotoRandomNumbers = []

for(i=0;i<NB_POSTS;i++){

    const photo = {}
    photo.path = faker.image.nature(1234, 2345, true)
    let postPhotoRandomNumber = faker.datatype.number({min: 1, max:NB_POSTS})
    while(postPhotoRandomNumbers.includes(postPhotoRandomNumber)){
        postPhotoRandomNumber = faker.datatype.number({min: 1, max:NB_POSTS})
    }
    postPhotoRandomNumbers.push(postPhotoRandomNumber)
    photo.post_id = postPhotoRandomNumber;
    postPhotos.push(photo);
}



// ---------- SEEDING ---------- 

(async () => {
    const client = new Client({
        connectionString: process.env.HEROKU_PG_URI,
        ssl: { rejectUnauthorized: false}, 
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
            ("email","first_name", "last_name","pseudo","date_of_birth", "password", "phone_number", "address","region", "zip_code", "city")
            VALUES
            ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING *
            `,
            [user.email, user.first_name, user.last_name, user.pseudo, user.date_of_birth, user.password, user.phone_number, user.address, user.region, user.zip_code, user.city],
        );
        queries.push(query);
    });  
    count = 0
    userPhotos.forEach((photo) => {
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
    count = 0
    friendships.forEach((friendship) => {
        count += 1;
        debug(`insert relation friendship for user ${friendship.user_id} and user ${friendship.friend_id} / request n°${count}` );
        const query = client.query(
            `
            INSERT INTO "friendship"
            ("user_id", "friend_id")
            VALUES
            ($1, $2)
            RETURNING *
            `,
            [friendship.user_id, friendship.friend_id],
        );
        queries.push(query);
    })
    count = 0
    posts.forEach((post) => {
        count += 1;
        debug(`insert post / request n°${count}` );
        const query = client.query(
            `
            INSERT INTO "post"
            ("user_id", "content", "title")
            VALUES
            ($1, $2, $3)
            RETURNING *
            `,
            [post.user_id, post.content, post.title],
        );
        queries.push(query);
    })
    count = 0
    postPhotos.forEach((photo) => {
        count += 1;
        debug('insert photo on post / ' + 'request n°' + count );
        const query = client.query(
            `
            INSERT INTO "photo"
            ("path", "post_id")
            VALUES
            ($1, $2)
            RETURNING *
            `,
            [photo.path, photo.post_id],
        );
        queries.push(query);
    });  
    count = 0

    await Promise.all(queries)

    debug('Done');

    client.end()

})()
