const express = require("express");
const route = express.Router();
const Schalk = require("../middleware/consoleHelper.js");
const fs = require('fs');
const adminModel = require("../Models/Admin.js"); 
const userModel = require("../Models/User.js");
const productModel = require("../Models/Product.js");
const {isAuth} = require("../middleware/auth.js");
const {adminSecure} = require("../middleware/auth.js");


// route.get("/dashboard/",isAuth,adminSecure,async(req,res)=>{ //isAuth
//     const displayMessage=false;
//     try {
//         const categoryData = await productModel.getAllCategory();
//         const productData = await productModel.getAllProducts();
//         const adminInfo = req.session.userData;
        
//         for(let i=0;i<productData.length;i++)
//         {
//             if(productData[i].categoryId != null)
//             {
//                 let catInfo = await productModel.getCategoryById(productData[i].categoryId);
//                 productData[i].categoryId = catInfo[0].categoryName;
//             }
//             if(productData[i].imgLocation != null)
//             {
//                 let dir = "";
//                 dir = "public/"+productData[i].imgLocation;// node reades the publicy documents top down server/public/img etc
//                 fs.readdir(dir,(err,files)=>{
//                     for(let j =0;j<files.length;j++)
//                     {
//                   //      console.log(files[j]);
//                     }
//                     productData[i].imgLocation = "../"+productData[i].imgLocation+files[0]; // images are read on pages as ../img/etc
//                    // console.log(productData[i].imgLocation);
//                 })
//             }
//         }
//         const userinfo = req.session.userData;
//         res.render("admin/adminDashboard",{
//             title:"Admin Dashboard",
//             adminInfo,
//             categoryData,
//             userinfo,
//             productData,
//             nav:true
//         });
//     } catch (error) 
//     {
//         console.log(error)
//     }

    
// });

route.get("/view-item",isAuth,adminSecure,async(req,res)=>{
    const displayMessage=false;
    try {
        const productData = await productModel.getAllProducts();
        const adminInfo = req.session.userData;
        
        for(let i=0;i<productData.length;i++)
        {
            if(productData[i].categoryId != null)
            {
                let catInfo = await productModel.getCategoryById(productData[i].categoryId);
                productData[i].categoryId = catInfo[0].categoryName;
            }
            if(productData[i].imgLocation != null)
            {
                let dir = "";
                dir = "public/"+productData[i].imgLocation;// node reades the publicy documents top down server/public/img etc
                fs.readdir(dir,(err,files)=>{
                    for(let j =0;j<files.length;j++)
                    {
                  //      console.log(files[j]);
                    }
                    productData[i].imgLocation = "../"+productData[i].imgLocation+files[0]; // images are read on pages as ../img/etc

                })
            }
        }
        const userinfo = req.session.userData;
        res.render("admin/view-item",{
            title:"Admin Dashboard",
            adminInfo,
            productData,
            userinfo,
            nav:true
        });
    } catch (error) 
    {
        console.log(error)
    }
})

route.post("/view-item",(req,res)=>{

})

route.get("/add-item",isAuth,adminSecure, async(req,res)=>{

    const displayMessage=false;
    try {
        const categoryData = await productModel.getAllCategory();
        const adminInfo = req.session.userData;
    
        res.render("admin/add-item",{
            title:"Admin Dashboard",
            adminInfo,
            categoryData,
            
            nav:true
        })
    }
    catch (error) 
    {
        console.log(error)
    }
})

route.post("/add-item",(req,res)=>{

})

route.get("/delete-item",(req,res)=>{

})
route.post("/delete-item",(req,res)=>{

})
route.get("/edit-item",(req,res)=>{

})
route.post("/edit-item",(req,res)=>{

})
module.exports = route;