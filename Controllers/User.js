const express = require('express');
const route = express.Router();
const userModule = require("../Models/User.js");
const {isAuth} = require("../middleware/auth.js");


// //!add validation middleware
// route.get("/adduser",(req,res)=>{
//     const userOnbj ={
//         firstName:"wesley",
//         lastName:"francis",
//         email:"wesley.ggg@hotmail.com",
//         password:"fewrewfsdgdfhdjggfjg",
//         imgPath:"default.pmg"
//     };
//     //Send Data to database
//     userModule.addUser(userOnbj)
//     .then(()=>{
//         res.json(userOnbj);
//     })
//     .catch()
// })

route.get("/dashboard",isAuth,(req,res)=>{

    if(req.session.userData.role == "user")
    {
        //get product object array
    const watchList = null// [{daf:"asf"},{asfasf:"gdhg"}];
    const userinfo = req.session.userData;
        res.render("user/userDashboard",{
            title:"UserDashboard",
                userinfo,
                watchList});
    }
    else
    {
        res.redirect("/admin/dashboard");
    }
})


module.exports = route;