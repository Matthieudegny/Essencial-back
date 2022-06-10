/* const country = {
    name: "France",
    pop: 45678765434567,
    forest: true,
    welcome() {
        console.log("bienvenue");
    },
    border: ["Espagne","Belgique", "Suisse", "Italie"]
};

console.log(country?.food); */

const { faker } = require('@faker-js/faker');
faker.locale = 'fr';

const x = faker.internet.email()

console.log(x);