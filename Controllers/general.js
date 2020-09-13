const express = require("express");
const router = express.Router();
const mammoth = require('mammoth');
const Schalk = require("../middleware/consoleHelper.js");
const csvFilePath="public/csv/eurusd.csv";
const mainCsv = require('csvtojson');
const mkdirp = require("mkdirp");
const { route } = require("./Product.js");
const productMOdel = require("../Models/Product.js");
const fs = require('fs');
const productModel = require("../Models/Product.js");

router.get("/",async(req,res)=>{
    try 
    {
       const prodData= await productModel.getAllProducts();
       const category= await productModel.getAllCategory();

        //---
   
            
            for(let i=0;i<prodData.length;i++)
            {
                if(prodData[i].categoryId != null)
                {
                    let catInfo = await productModel.getCategoryById(prodData[i].categoryId);
                    prodData[i].categoryId = catInfo[0].categoryName;
                }
                if(prodData[i].imgLocation != null)
                {
                    let dir = "";
                    dir = "public/"+prodData[i].imgLocation;// node reades the publicy documents top down server/public/img etc
                    fs.readdir(dir,(err,files)=>{
                        for(let j =0;j<files.length;j++)
                        {
                      //      console.log(files[j]);
                        }
                        prodData[i].imgLocation = "../"+prodData[i].imgLocation+files[0]; // images are read on pages as ../img/etc
    
                    })
                }
            }
        //---


        let categories=[];
        for(let i=0;i<4;i++)
        {
            categories.push(category[i]);
        }
        let userinfo = false;
        if(req.session.userData)
        {
            userinfo = req.session.userData;
        }
        else{
            userinfo = false;
        }
        res.render("general/home",{
            title:"ShopTop | Shop till you Drop",
            userinfo,
            nav:true,
            categories,
            prodData
            });
    } 
    catch (error) 
    {
        console.log(error)
    }



    
   // Schalk.generalError("navigated to home route")
})

router.post("/chart",(req,res)=>{
    mainCsv()
    .fromFile(csvFilePath)
    .then((jsonObj)=>{
        const newObj=[];
            for(let i=0;i<2;i++)
            {
                newObj.push(jsonObj[i]);
            }
            const u = req.body.title;
        res.json({info : u,
                data:newObj})
    })
})

router.get("/products/:id",(req,res)=>{
  
    const id = req.params.id;

    if(id)
    {
        productMOdel.getProductById(id)
        .then((item)=>{
            if(item[0].descriptionDocxPath.length == 0)
            {
                const prodData = item[0];
                productMOdel.getCategoryById(prodData.categoryId)
                .then((category)=>{
                    //! to be passed to the front end to be displayed to the user. in the item description
                    let imgArray = [];
                    let dir = "";
                    dir = "public/"+prodData.imgLocation;// node reades the publicy documents top down server/public/img etc
                    fs.readdir(dir,(err,files)=>{
                        imgArray = files;
                        const imgGal = {
                            dirLocation: prodData.imgLocation,
                            images:files
                        }
                        const userinfo = req.session.userData;
                          // images are read on pages as ../img/etc
                          prodData.category = category[0].categoryName;
                          res.render("user/productPage",{
                              title:`${item[0].title}`,
                              nav:true,
                              prodData,
                              imgGal,
                              userinfo
                          });
                    })
                })
                .catch((err)=>{
                    console.log(err);
                })
            }
            else
            {
               
                const prodData = item[0];
                productMOdel.getCategoryById(prodData.categoryId)
                .then((category)=>{
                    //! to be passed to the front end to be displayed to the user. in the item description
                    let imgArray = [];
                    let dir = "";
                    dir = "public/"+prodData.imgLocation;// node reades the publicy documents top down server/public/img etc
                    fs.readdir(dir,(err,files)=>{
                        imgArray = files;
                        const imgGal = {
                            dirLocation: prodData.imgLocation,
                            images:files
                        }
                        const userinfo = req.session.userData;
                          // images are read on pages as ../img/etc
                          prodData.category = category[0].categoryName;
                        mammoth.convertToHtml({path: `public/${item[0].descriptionDocxPath}`}) //!  methong to convert the uploaded docx file to html 
                        .then(function(result){                                                   //! to be passed to the front end to be displayed to the user. in the item description/
                            const html = result.value; // The generated HTML
                            const messages = result.messages; // Any messages, such as warnings during conversion
                            const Description = html;
                            res.render("user/productPage",{
                                title:`${item[0].title}`,
                                nav:true,
                                prodData,
                                imgGal,
                                userinfo,
                                Description
                            });
                        })
                        .done();
                    })
                })
                .catch((err)=>{
                    console.log(err);
                })
            }
        })
        .catch((err)=>{console.log(err)})
    }
    // mkdirp('public/docs/wesle757')//! MAKE A DIRECTORY FOR A USER. this can my a composition of firstname and userId. Wold be used to fetch the docx file for that user's docx. file./
    // .then((made)=>{
    //     console.log(made);
    // })
    
    
})




//!Tested HTML UPLOADS and READING
// router.get("/docd",(req,res)=>{
//     mammoth.convertToHtml({path:`./public/docs/userName/Privacy Policy.docx`})
//     .then((result)=>{
//         const html = result.value; //generated HTML
//         const mess = result.messages; //errors
//         res.send(html);
//     })
// })






module.exports = router;