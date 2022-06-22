const inputData = {
    email: "agijh@gmail.org",
    password: "yhkjnl,oilhkjn",
    test:'',
    city: "Paris",
    street:''
}

for(let[key,value] of Object.entries(inputData)){
    if(!value){
        Reflect.deleteProperty(inputData, key);
    }
}

console.log(inputData);