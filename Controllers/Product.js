const express = require("express");
const router = express.Router();
const watchlater = require("../Models/Product.js") //? inport watchlater function
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



router.post("/additem",productUpload,(req,res)=>{
        
    res.json(req.productData);
})

module.exports = router;