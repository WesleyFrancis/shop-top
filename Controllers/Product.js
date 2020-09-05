const express = require("express");
const router = express.Router();
const productModel = require("../Models/Product.js") //? inport watchlater function
const productPOJO = require("../Models/POJO/productPOJO.js");
const {productUpload} = require("../middleware/validation.js");
const mkdirp = require("mkdirp");

router.put("/watchlater/:uid/:prodid",(req,res)=>{

  watchlater.addToWatchLater(req.params.uid,req.params.prodid)
    .then((info)=>{
        res.json(info);
    })
    .catch((err,stat)=>{console.log(`C|PRODUCT ${stat.success}  ${err}`)})
})

router.post("/additem",productUpload,async(req,res)=>{
   try {
    productModel.addProduct(req.productData);
    res.status(200).redirect("/admin/dashboard")
   } catch (error) {
       console.log(error);
   }
})

module.exports = router;