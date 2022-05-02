let localStorage = require('node-localstorage').LocalStorage;
localStorage = new localStorage('./data');

exports.storeUser = function(users,data){
    if(data)
         users.push(data);
    localStorage.setItem('users',JSON.stringify(users));
}

exports.getUsers = function(){
    let users = JSON.parse(localStorage.getItem('users'));
    return users;
}

const init = function(){
    localStorage.setItem('users',JSON.stringify([]));
}

init();