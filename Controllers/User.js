const express = require('express');
const route = express.Router();
const userModule = require("../Models/User.js")
//!add validation middleware
route.get("/adduser",(req,res)=>{
    const userOnbj ={
        firstName:"wesley",
        lastName:"francis",
        email:"wesley.ggg@hotmail.com",
        password:"fewrewfsdgdfhdjggfjg",
        imgPath:"default.pmg"
    };
    //Send Data to database
    userModule.addUser(userOnbj)
    .then(()=>{
        res.json(userOnbj);
    })
    .catch()
})

route.get("/dashboard",(req,res)=>{
    userModule.getUser(1) //get user information -- session can be used instead
    //get watch later information
    //get order history
    .then((rows,fields)=>{
        const userData = rows[0];
        userData.firstName= userData.firstName.toUpperCase();
        userData.lastName= userData.lastName.toUpperCase();
     //   userData.lastName= userData.lastName[0].toUpperCase() + userData.lastName.slice(1)
        res.render("user/userDashboard",{
            title:"UserDashboard",
            userData
        });
    })
    .catch()
})


module.exports = route;