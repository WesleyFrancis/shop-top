const express = require("express");
const router = express.Router();
const productModel = require("../Models/Product.js") //? inport watchlater function
const productPOJO = require("../Models/POJO/productPOJO.js");
const {productUpload} = require("../middleware/validation.js");
const mkdirp = require("mkdirp");

router.get("/watchlater/:uid/:prodid",(req,res)=>{

    productModel.addToWatchLater(req.params.uid,req.params.prodid)
    .then((info)=>{
        res.redirect("/");
    })
    .catch((err)=>{console.log(`${err}`)})
})

router.post("/additem",productUpload,async(req,res)=>{

 //   res.json(req.productData);
   try 
   {
        productModel.addProduct(req.productData)
        .then((rest)=>{
            res.redirect("/admin/view-item")
        })
        .catch((err)=>{console.log(err)})
   }
   catch (error) 
   {
       console.log(error);
   }
})

module.exports = router;