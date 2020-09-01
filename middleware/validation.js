const bcrypt = require("bcryptjs");
const User = require("../Models/POJO/userPOJO.js");
const productPOJO = require("../Models/POJO/productPOJO.js");
const {v4: uuidv4} = require('uuid');
const userModel = require("../Models/User.js");

exports.loginFormValidation = (req,res,next)=>{
    const user = new User();
    user.email = req.body.email;
    user.password = req.body.password;

   // req.user = user;//@create a temp request object and assign a value to it so it can be access on another page

    let isErr = false;
    const errors = {
        email:null,
        password:null,
    }

    if(user.email =="")
    {
        isErr = true;
        errors.email = "you must enter an email";
    }

    if(user.password =="")
    {
        isErr = true;
        errors.password = "you must enter a Password";
    }

    //if there is no error.
    if(!isErr)
    {
       //1 check to see if the entered email exists in db
       //if t does return all that user info from the database.
       //compare the password.
       let regString = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
       if (regString.test(user.email)) //+ test to see if the email is valid
       {
            errors.email = null;
            isErr = false;
       }
       else{
           errors.email = "That is not the format of an email.";
           isErr = true;
       }   
     userModel.getUserFromLogin(user.email)
      .then((userInformation)=>{
        //if this user has a value that is not null then it means that the email exists
        // res.send(userInformation[0].password)
        bcrypt.compare(req.body.password,userInformation[0].password)
        .then((val)=>{
            userInformation[0].password ="";
            req.userData = userInformation[0];
           next();
        })
        .catch((err)=>{
            errors.email = "Email or password is incorrect";
            errors.password = "Email or password is incorrect";

            res.status(400).json(errors)
        })    


      })
      .catch(err=>console.log(`Error :failure to get user by email: ${err}`))

    }
    else// these errors is if they did not enter a password or eamail
    {
        res.status(400).json({
            errors
        })
    }
};

exports.registerFormValidation = (req,res,next)=>
{
    /*  get the information from the front end and  
        validate it. 
        test if it exists
        test if reg expression for email
        test if password match
        once that's done call the next parameter
    */
    const user = new User();

    user.firstName =  req.body.firstName;
    user.lastName = req.body.lastName;
    user.email = req.body.email;
    user.password = req.body.password;
    
    let error = {
        firstName:null,
        lastName:null,
        email:null,
        password:null,
        Cpassword:null,
        errState:false
    }
    if(user.firstName == "")
    {
        error.firstName="Please enter a first name",
        error.errState = true;
    }
    if(user.lastName == "")
    {
        error.lastName="Please enter a last name",
        error.errState = true;
    }
    if(user.email == "")
    {
        error.email="Please enter an email",
        error.errState = true;
    }
    if(user.password == "")
    {
        error.password="Please enter a password",
        error.errState = true;
    }
    if(user.Cpassword == "")
    {
        error.email="Please confirm your password",
        error.errState = true;
    }

    if(error.errState == false)
    {
        //req.user = user;
        //No Errors All feilds filled out
        //test for email format
        //test to see if password's match

        let regString = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (regString.test(user.email)) //+ test to see if the email is valid
        {
            error.email = null;
            error.errState = false;
        }
        else{
            error.email = "That is not the format of an email.";
            error.errState = true;
        }    
        
        if(req.body.password != req.body.Cpassword) //+ check to see if the passwords match
        {
            error.password = "Your password does not match";
            error.errState = true;
        }
        else
        {
            if(req.body.password.length < 7)
            {
                error.password = "Your password must be atleast 7 characters long ";
                error.errState = true;
            }
        }
        if(error.errState == false)//? if no ERRORS EXIT
        {
            req.user = user; //+ return an object to the next method in the middleware series
            next();
        }
        else 
        {
            res.status(400).json(error);
        }
    }
    else
    {
        res.status(400).json({
            error
        })
    }
    
}

exports.productUpload = (req,res,next) =>
{
    const itemCont = new productPOJO();
    itemCont.title = req.body.title;
    itemCont.quantity = req.body.quantity;
    itemCont.price = req.body.price;
    itemCont.costPrice = req.body.costPrice;
    itemCont.min = req.body.min;
    itemCont.max = req.body.max;
    itemCont.likes = 0;
    itemCont.description = req.body.description;
    itemCont.category = req.body.category;
    itemCont.imgLocation = req.files.prodImg; // user forces to upload an image at form

    //TODO makesure the datatype of the images are supported jpeg,jpg,png,gif
    //todo change the name of the all the images that are uploaded
    //todo create a directory for the images and move them to that location
    //* ------------- IMAGES ------------------
    if(req.files.prodImg == null)
    {
        itemCont.imgLocation = "";
    }
    else{
        itemCont.descriptionDocxPath == req.files.productDocument
    }
    
    //todo cmakesure the document uploaded is a docx filetype
    //todo makesure rename the document and move it to a location
    //* ------------- DOCX ------------------
    if(req.files.productDocument == null)
    {
        itemCont.descriptionDocxPath = "";
    }
    else
    {
        const docDecriptionName = req.files.productDocument.name.split(".");
        if(docDecriptionName[1]== "docx" || docDecriptionName[1] == "doc")
        {
            const NewName = uuidv4();//create a unique name for the file
            req.files.productDocument.name = NewName+"."+docDecriptionName[1]; //+ stich the generated name and the file type together to build a new name
            req.files.productDocument.mv(`public/docs/${req.files.productDocument.name}`,(err)=>{
                res.status(400).json({Error:`${err}`});
            });

            itemCont.descriptionDocxPath = req.files.productDocument.name;
            req.productData = itemCont;
        }
        else
        {
            res.json({error:"Not a document"});
        }
    }
    //! must remember the name of the location for both file uploades   
    next();
}