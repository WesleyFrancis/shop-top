const express = require("express");
const router = express.Router();
const User = require("../Models/POJO/userPOJO.js");
const {loginFormValidation} = require("../middleware/validation.js");
const {registerFormValidation} = require("../middleware/validation.js");
const userModel = require("../Models/User.js");
const bcrypt = require("bcryptjs");
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

router.get("/login",(req,res)=>{
    res.status(200).render("general/login",{
        title:"Login | Shop Top",
        nav:false
    })
})

router.post("/login",loginFormValidation,(req,res)=>{
    req.session.userData = req.userData;
    if(req.session.userData.role == "user")
    {
        res.redirect("/user/dashboard");
    }
    else if(req.session.userData.role == "admin")
    {
        res.redirect("/admin/view-item");
    }
    
})

router.get("/register",(req,res)=>{
    res.status(200).render("general/register",{title:"Register User",
                nav:false});
 })

 router.post("/register",registerFormValidation,(req,res)=>{
    //* after validating the information has to be passed to the model to insert into the database
    //*after insertation the application has to create a session and redirect the user to their dashboard / homepage
    


    bcrypt.genSalt(10)
    .then((salt)=>{
        bcrypt.hash(req.user.password, salt)
        .then((hash)=>{
            req.user.password = hash; // set the user object password to the hashed version
            userModel.addUser(req.user)
            .then(()=>{
                // using Twilio SendGrid's v3 Node.js Library
                // https://github.com/sendgrid/sendgrid-nodejs wesley6216
                
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                to: 'blender6216@hotmail.com',
                from: 'wesley.francis@hotmail.com',
                subject: `Hello ${req.user.firstname} Welcome to ShopTop | Your all in one online solution`,
                text: 'and easy to do anywhere, even with Node.js',
                html: 'Be sure to explore our catalogs',
                };
                (async () => { //ES* empty async arrow function with a try catch 
                    try 
                    {
                      await sgMail.send(msg);
                      res.redirect("/auth/login");
                    } 
                    catch (error) 
                    {
                      console.error(error);
                      if (error.response) 
                      {
                        console.error(error.response.body)
                      }
                    }
                  })();
            })
            .catch((err)=>{
                console.log(`C|Auth| ${err}`)
            })
            // subbmit the 
        })
        .catch((err)=>console.log(err))
    })
    .catch((err)=>console.log(err))
 })

router.get("/logout",(req,res)=>{
    req.session.destroy();
    res.redirect("/")
})

module.exports = router;