const express = require('express');
const route = express.Router();
const userModule = require("../Models/User.js");
const {isAuth} = require("../middleware/auth.js");
const productModel = require("../Models/Product.js");
// const userModel = require('../Models/Admin.js');


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
//+------------------------------------------------------------------+
//+                   Calculate open positions                       |
//+------------------------------------------------------------------+
route.get("/dashboard",isAuth,(req,res)=>{

    if(req.session.userData.role == "user")
    {
        //get product object array
    let watchList = null// [{daf:"asf"},{asfasf:"gdhg"}];
    userModule.getCustomerInfo(req.session.userData.userId)
    .then((result)=>{
        productModel.getWatchLater(result[0].customerId)
        .then((resule)=>{
            watchList = resule[0];
            const userinfo = req.session.userData;
            res.render("user/userDashboard",{
                title:"UserDashboard",
                    userinfo,
                    watchList,
                    nav:true
                    });
        })
        .catch((err)=>{
            console.log(err)
        })
    })
    .catch((err)=>{
        console.log(err);
    })
   
    }
    else
    {
        res.redirect("/admin/dashboard");
    }
})


module.exports = route;