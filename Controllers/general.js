const express = require("express");
const router = express.Router();
const mammoth = require('mammoth');
const Schalk = require("../middleware/consoleHelper.js")

router.get("/",(req,res)=>{
    res.render("general/home");
    Schalk.generalError("navigated to home route")
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