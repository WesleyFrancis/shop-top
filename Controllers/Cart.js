const express = require('express');
const Routes = express.Router();
const {isAuth} =  require("../middleware/auth.js");
const cartModule = require("../Models/Cart.js");
const productModel = require("../Models/Product.js");
const fetch = require('node-fetch');
const cartModel = require('../Models/Cart.js');
const { json } = require('express');


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

Routes.get("/checkout",isAuth,(req,res)=>{
    cartModel.getCards(req.session.userData.userId) //+ check to see if the user has a card already This should determine in this is skipped or not
        .then((rows)=>{
            const cards = rows[0];
            const totalCards = rows[0].length;

            if(cards.length>0)
            {//+ There's a card on file we can use that and continue
                //! redirect to select address as there's a card on file already
                res.render("user/checkout",{
                    nav:true,
                    orderTotal:691.80,
                    hasCard:true,
                    cards,
                    userinfo:req.session.userData,
                })

            }
            else{//+ Setup blueSnap
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
                        // console.log(loc)
                        res.render("user/checkout",{
                            nav:true,
                            orderTotal:691.80,
                            token:token,
                            code:code,
                            hasCard:false,
                            userinfo:req.session.userData,
                        })
                    })
                    .catch(err => console.log(err))
                
                
            }
            //TODO : only let user add card to file if they need to if not they can continue to the select addres page 
            //TODO : need to add more info to db to add shipping and billing address
            //TODO : calculate cart total in that route before sending data to user. store sub total in local session
            //TODO : find a way to host order history and remove items from card after checkout finish
            //TODO : add delete item to cart items, use fetch to async delete, fade on delete
        })
        .catch((e)=>{
            console.warn(e)
        })
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
    cartModule.addNewCard(cardData,req.session.userData.userId,0);
            //TODO make another request to their server and save the shopper information to the token
        
    const headers = {
        'Content-Type': 'application/json',
        'Accept':'application/json',
        'bluesnap-version': '3.0',
        'Authorization': `Basic QVBJXzE0NDQ2NTAyMDMxNDQ5NDA0MjIzNjU6QkxVRTEyMw==`
    }

let vdata =    {
        "amount": 11,
        "softDescriptor": "DescTest",
        "cardHolderInfo": {
          "firstName": "test first name",
          "lastName": "test last name",
          "zip": "123456"
        },
        "currency": "USD",
        "cardTransactionType": "AUTH_CAPTURE",
        "pfToken": `${req.body.token}`
}
    vdata =JSON.stringify(vdata);
console.table(vdata+"-----------------------------------------------------------");
    fetch('https://sandbox.bluesnap.com/services/2/transactions',{
        method:'POST',
        headers:headers,
        body: vdata
    })
    .then((response)=>
    {
        if (response.ok) 
        {
            return response.json();
        }
        return Promise.reject(response);
    }).then((data)=>
    {
        console.log(data);
    })
    .catch((error)=>
    {
        console.warn('Something went wrong.', error);
    });
            
    cartModule.addNewCard(cardData,req.session.userData.userId)
    .then((m)=>{

    })
    .catch((e)=>{
        res.status(400).json({success:false})
        console.warn(e);
    })
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

Routes.get("/delete/:id",(req,res)=>{
    //+ delete order from cart where user id = this user. and orderid = delete id
})
module.exports = Routes;

//bluesnap-version: 2.0 add to the header to specsy which api i'm using to save shopper


