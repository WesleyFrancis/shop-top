//! ---------------------------- REQUIRE -------------------------------------//
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mySql = require("./config/mysqlDAO.js");
const session = require('express-session');
const fileUpload = require('express-fileupload');
const mammoth = require('mammoth');
const {uuidv4} = require('uuid');
//!---------------------------- REQUIRE -------------------------------------//
//+---------------------------- MIDDLEWARE -------------------------------------//
const app = express();

const helper = exphbs.create({ //Handlebars helpers for client side rendering
    helpers:{
        ifEq(a,b,options)
        {
            if(a==b)
            {
                return options.fn(this)
            }
            else{
                return options.inverse(this)
            }
        }
    }
})

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.engine('handlebars', helper.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
require('dotenv').config({path:"config/keys.env"});
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json())
app.use(session({
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    //cookie:{secure:false}
}))
//+---------------------------- MIDDLEWARE -------------------------------------//
//!---------------------- IMPORT & ASSIGN CONTROLLERS --------------------------//
const adminController = require("./Controllers/Admin.js");
const generalController = require("./Controllers/General.js");
const userController = require("./Controllers/User.js");
const productController = require("./Controllers/Product.js");
const authController = require("./Controllers/Auth.js");
const cartController = require("./Controllers/Cart.js")
//!---------------------- IMPORT & ASSIGN CONTROLLERS --------------------------//
//?--------------------------------- ROUTES ------------------------------------//
app.use("/",generalController);
app.use("/admin",adminController);
app.use("/user",userController);
app.use("/item",productController);
app.use("/cart", cartController);
app.use("/auth", authController);
//?--------------------------------- ROUTES ------------------------------------//
//+------------------------------ START SERVER ----------------------------------//
const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("Server is runningGGG");
    mySql.init();
})
//+------------------------------ START SERVER ----------------------------------//
