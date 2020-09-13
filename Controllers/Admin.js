const express = require("express");
const route = express.Router();
const Schalk = require("../middleware/consoleHelper.js");
const fs = require('fs');
const adminModel = require("../Models/Admin.js"); 
const userModel = require("../Models/User.js");
const productModel = require("../Models/Product.js");
const {isAuth} = require("../middleware/auth.js");
const {adminSecure} = require("../middleware/auth.js");

route.get("/dashboard",(req,res)=>{
    res.redirect("/admin/view-item");
})

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
        const userinfo = req.session.userData;
        res.render("admin/add-item",{
            title:"Admin Dashboard",
            categoryData,
            userinfo,
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

route.get("/delete-item/:id",async(req,res)=>{

    try {
       const prodData =  await productModel.getProductById(req.params.id)
        const prodImgLoc = prodData[0].imgLocation;
        const dir = `public/${prodImgLoc}`;
        console.log(dir);
        const d = await productModel.deleteProductById(req.params.id)
        fs.rmdir(dir, { recursive: true }, (err) => {
            if (err) {
                throw err;
            }
            res.redirect("/admin/view-item");
        });
        
    } 
    catch (error) {
        console.log(error);
    }
})
route.post("/delete-item",(req,res)=>{

})
route.get("/edit-item/:id",isAuth,adminSecure,(req,res)=>{
    const userinfo = req.session.userData;

    productModel.getProductById(req.params.id)
    .then((info)=>{
        const productData = info[0];
        res.render("admin/edit-item",{
            productData,
            userinfo,
            nav:true
        })
    })
    .catch((err)=>{
        console.log(err);
    })
})
route.post("/edit-item",(req,res)=>{

})
//-- categories
route.get("/view-category",isAuth,adminSecure,(req,res)=>{
    const userinfo = req.session.userData;
    productModel.getAllCategory()
    .then((category)=>{
        res.render("admin/view-category",{
            title: "Admin | view Category",
            nav:true,
            category,
            userinfo
        })
    })
    .catch()
})
route.get("/edit-category/:id",isAuth,adminSecure,(req,res)=>{
    const catId= req.params.id;
    const userinfo = req.session.userData;
    productModel.getCategoryById(catId)
    .then((catinfo)=>{
        category = catinfo[0];
        res.render("admin/edit-category",{
            title: "Admin | edit category",
            nav:true,
            category,
            userinfo
        })
    })
    .catch((err)=>{console.log(err)})
})
module.exports = route;