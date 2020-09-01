const express = require("express");
const router = express.Router();
const mammoth = require('mammoth');
const Schalk = require("../middleware/consoleHelper.js");
const csvFilePath="public/csv/eurusd.csv";
const mainCsv = require('csvtojson');
const mkdirp = require("mkdirp");
const { route } = require("./Product.js");

router.get("/",(req,res)=>{
    const categories = [{name:"Electronics",img:"img/category/footware.png"},{name:"computers",img:"img/category/medical.png"}] 
    const products =[{
        thumbsUp:"200",
        prodImg:"img/category/apparel.png",
        productName:"Lorem Ipsum is simply dummy text of the printing and typesetting",
        category:"health & beauty",
        prodId:21,
        prodPrice:"3078.98"
        },
        {
            thumbsUp:"699",
            prodImg:"img/category/medical.png",
            productName:"Cherisee is the most awesome girlfriend evererererrrrrrrr",
            category:"furniture",
            prodId:27,
            prodPrice:"4295.97"
            }];
    res.render("general/home",{
        title:"ShopTop | Shop till you Drop",
        categories,
        products,
        nav:true

        });
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
    mkdirp('public/docs/wesle757')//! MAKE A DIRECTORY FOR A USER. this can my a composition of firstname and userId. Wold be used to fetch the docx file for that user's docx. file./
    .then((made)=>{
        console.log(made);
    })
    mammoth.convertToHtml({path: "public/docs/userName/Privacy Policy.docx"}) //!  methong to convert the uploaded docx file to html 
    .then(function(result){                                                   //! to be passed to the front end to be displayed to the user. in the item description/
        const html = result.value; // The generated HTML
        const messages = result.messages; // Any messages, such as warnings during conversion
        const Description = html;
      //  res.send(Description);
        res.render("user/productPage",{
            title:"product Page",
            id,
            Description
        });
    })
    .done();
    
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