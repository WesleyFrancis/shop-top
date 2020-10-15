const express = require('express');
const Routes = express.Router();
const {isAuth} =  require("../middleware/auth.js");
const cartModule = require("../Models/Cart.js");
const productModel = require("../Models/Product.js");
const fetch = require('node-fetch');


Routes.get("/",async(req,res)=>{
    let cartInfo =[];
    let products = [];
    let tempProd =[];
    let a;
    if(!req.session.userData)
    {
        res.render("user/cart",{
            title:"Welcome to your cart",
            nav:true,
            data:"<h1>add something</h1>"
        })
    }
    else{
        try {
//+-- fetch all the items and quantities for each order in the cart 

            cartInfo = await cartModule.getcartItems(req.session.userData.userId);
            if(cartInfo[0].length>0)
            {
                const asyncRes = await Promise.all(
                    cartInfo[0].map(async(info,i)=>
                    {
                        tempProd = await productModel.getProductById(info.productCode);
                        
                        products.push(tempProd[0]);
                        return(tempProd[0])
    //+-- for each cart item get the product code and fetch the information for it
                    })
                ) 
                // console.log(asyncRes);
                const data = req.session.userData;
 
                res.render("user/cart",{
                    nav:true,
                    data:asyncRes,
                    userinfo:data,
                    prodInfo:{
                        totalItem:3,
                        subTotal:3
                    }
                });
            }
        } 
        catch (error) 
        {
            console.log(`erroe getting cart items ${error}`)
        }
                
    }
    
})

Routes.get("/add/:id", async(req,res)=>{
    const cartinfo = {
        productCode:req.params.id,
        customerId:req.session.userData.userId, //TODO: for this to work i would have to enforce user having to be logged in
        quantity:1
    }
    try {
        cartModule.addToCart(cartinfo);
        res.redirect("/cart/");
    } catch (error) {
        console.log(`ADDING TO CART ${error}`);
    }

})

Routes.get("/checkout",(req,res)=>{
let code = `${process.env.B_SNAP_KEY}`;
const headers = {
    'Content-Type': 'application/json',
    'Accept':'application/json',
    'Authorization': `Basic ${code}`,

  }

    fetch('https://sandbox.bluesnap.com/services/2/payment-fields-tokens/',{
        method:'POST',
        headers:headers
    })
  .then(response => {
        let loc="";
        loc = response.headers.get('Location');
        let toeknArray = loc.split("/");
        let token  = toeknArray[6];
        res.render("user/checkout",{
            nav:true,
            orderTotal:691.80,
            token:token,
            code:code
        })
    })
  .then(data => {
   
  })
  .catch(err => console.log(err))
})

Routes.post("/add-card",(req,res)=>{
    console.log(req.body.ccType)
    const cardData = {
        binCategory: req.body.binCategory,
        cardSubType: req.body.cardSubType,
        ccBin: req.body.ccBin,
        ccType: req.body.ccType,
        exp: req.body.exp,
        isRegulatedCard: req.body.isRegulatedCard,
        issuingCountry: req.body.issuingCountry,
        last4Digits: req.body.last4Digits
    }
    // cartModule.addNewCard(cardData,req.session.userData.userId,vaultedShopperId);
    console.log(cardData);
    res.status(200).json(cardData);
})

Routes.get("/pay",(req,res)=>{ 
    //+ display last page for checkout process let the user confirm 1 
    //+more time if they are sure they want to continue

    res.render("user/payConfirm",{
        title:"Payment Confirmation",
        nav:true,
        userinfo:req.session.userData,
        
    })
})
Routes.post("/pay",(req,res)=>{
    const cardData = {
        "firstName": `${req.body.firstName}`,
        "lastName": `${req.bosy.lastName}`,
        "country": "tt",
        "zip": "00000",
        "phone": `${req.body.phone}`,
        "shopperCurrency": "USD",
        "paymentSources": {
            "creditCardInfo": [
                {
                    "pfToken" : `${req.body.token}`
                }
            ]
            
        }
    }
    const headers = {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'Authorization': `Basic ${code}`,
    
      }
    const url="https://sandbox.bluesnap.com/services/2/vaulted-shoppers";
    fetch(url,{
        method:"POST",
        headers:headers,
        payload:cardData
    })
    .then((respon)=>{
        console.log(respon)
    })
    .catch((e)=>{
        console.log(e)
    })
})

module.exports = Routes;