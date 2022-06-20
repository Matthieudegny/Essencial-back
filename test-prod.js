const { faker } = require('@faker-js/faker');

const friendships = [];
const NB_FRIENDSHIP = 500;

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

friendshipTest = new Set(friendships)

console.log(friendshipTest);


