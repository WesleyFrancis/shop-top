const express = require("express");
const route = express.Router();
const adminModel = require("../Models/Admin.js"); 
const userModel = require("../Models/User.js");
const Schalk = require("../middleware/consoleHelper.js");

route.get("/dashboard",(req,res)=>{
    //get the admin information.
    adminModel.getAdminInfo(1)
    .then((adminInfo)=>{
        userModel.getUser(adminInfo[0].userId)
        .then((rows)=>{

          const clerkInfo = rows[0];
            res.render("admin/adminDashboard",{
                title:"Admin Dashboard",
                clerkInfo
            })
        })
        .catch((err)=>{Schalk.dbError(`C|ADMIN | DASHBOARD ${err}`)})
    })
    .catch((err)=>{Schalk.generalError(`C|ADMIN| ${err}`)})
    
});

module.exports = route;