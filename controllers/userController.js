const database = require('./../utils/database');
const { v4: uuidv4 } = require('uuid');

exports.getAllUser = function(req,res){
    let users = database.getUsers();
    if(req.query.name){
        
        const {name,limit=0} = req.query;
        users = getAutoSuggestUsers(name,limit).length>0 ? getAutoSuggestUsers(name,limit) : users;
    }
   
    res.status(200).json({
        status:"success",
        results: users.length,
        users

        
    })
}

exports.getUser = function(req,res){
    const id = req.params.id;
    const user = getUserById(id);
    if(user){
        res.status(200).json({
            status:"success",
            user

        
        })
    }else{
        res.status(404).json({
            status:"Fail",
            message:`User with id : ${id} does not exist`

        
        })
    }
}

exports.createUser = function(req,res){
    const users = database.getUsers();
    const user = req.body;
    user.id=uuidv4();
    database.storeUser(users,user);
    res.status(200).json({
        status:"success",
        message:"User added successfully"
    })
}

exports.updateUser = function(req,res){
    const id = req.params.id;
    const user = updateUserById(id,req.body);
    if(user){
        res.status(200).json({
            status:"User updated successfully",
            user
        })
    }else{
        res.status(404).json({
            status:"Fail",
            message:`User with id : ${id} does not exist`
        
        })
    }
}
exports.deleteUser = function(req,res){
    const id = req.params.id;
    const flag = deleteUserById(id);

    if(flag){
        res.status(200).json({
            status:"User deleted successfully",
        
        })
    }else{
        res.status(404).json({
            status:"Fail",
            message:`User with id : ${id} does not exist`
        
        })
    }
}



exports.validateUser = function(req,res,next){
    const {name,password,age} = req.body;
    if(!name  || !(typeof name === 'string')){
       return res.status(400).json({
            status:"Fail",
            message:'A user must have a proper user name'

        })
    }
    if(!password || !(typeof password === 'string')){
        return res.status(400).json({
            status:"Fail",
            message:'A user must have a proper password'

        })
    }
    if(!age || !(typeof age === 'number')){
        return res.status(400).json({
            status:"Fail",
            message:'A user must have an age in proper format'

        })
    }
    next();
}

const getUserById = function(id){
    const users = database.getUsers();
    return users.find(user=> user.id === id);
}

const deleteUserById = function(id){
   const users = database.getUsers();
   let flag = false;
   users.forEach(user =>{
       if(user.id===id){
           user.isDeleted = true;
           flag = true;
       }
   })
    database.storeUser(users)
    return flag;
}

const updateUserById = function(id,data){
    let users = database.getUsers();
   
    users.forEach(user=>{
        if(user.id === id){
           Object.assign(user,data);
            
        }
    })

    database.storeUser(users)

    return getUserById(id)
}

const getAutoSuggestUsers = function(name,limit){
    let users = database.getUsers();
    users = users.filter(user=>{
        return user.name.includes(name);
    })

    // console.log(users)
    if(limit===0)
        limit=users.length;
    return users.slice(0,limit);
}