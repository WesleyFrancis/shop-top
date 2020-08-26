//! ---------------------------- REQUIRE -------------------------------------//
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mySql = require("./config/mysqlDAO.js");
const session = require('express-session');
const fileUpload = require('express-fileupload');
const mammoth = require('mammoth');
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
app.use(session({
    secret:'ThisIsUnBreakAble',
    resave:false,
    saveUninitialized:true,
    //cookie:{secure:false}
}))

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));

app.engine('handlebars', helper.engine);
app.set('view engine', 'handlebars');
app.use(express.static('public'));
require('dotenv').config({path:"config/keys.env"});
app.use(bodyParser.urlencoded({extended:false}));
//+---------------------------- MIDDLEWARE -------------------------------------//
//!---------------------- IMPORT & ASSIGN CONTROLLERS --------------------------//
// const adminController = require("./controllers/admin");
const generalController = require("./Controllers/general.js");
// const taskController = require("./controllers/tasks");
// const userController = require("./controllers/user");
// const authController = require("./controllers/auth.js");
//!---------------------- IMPORT & ASSIGN CONTROLLERS --------------------------//
//?--------------------------------- ROUTES ------------------------------------//
app.use("/",generalController);
// app.use("/admin",adminController);
// app.use("/user", userController);
// app.use("/task", taskController);
// app.use("/auth", authController);
//?--------------------------------- ROUTES ------------------------------------//


//+------------------------------ START SERVER ----------------------------------//
const PORT=process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log("Server is runningGGG");
})
//+------------------------------ START SERVER ----------------------------------//
