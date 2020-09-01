const express = require("express");
const route = express.Router();
const Schalk = require("../middleware/consoleHelper.js");

const adminModel = require("../Models/Admin.js"); 
const userModel = require("../Models/User.js");
const productModel = require("../Models/Product.js");
const {isAuth} = require("../middleware/auth.js");
const {adminSecure} = require("../middleware/auth.js");


route.get("/dashboard",isAuth,adminSecure,async(req,res)=>{

    try {
        const categoryData = await productModel.getAllCategory()
        
        const adminInfo = req.session.userData;
    res.render("admin/adminDashboard",{
        title:"Admin Dashboard",
        adminInfo,
        categoryData
    });
    } catch (error) {
        
    }

    
});



module.exports = route;