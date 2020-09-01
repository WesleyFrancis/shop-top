exports.isAuth = (req,res,next)=>{

    if(req.session.userData)
    {
        next();
    }
    else{
        res.redirect("/");
    }

}

exports.adminSecure = (req,res,next)=>
{
    if(req.session.userData.role == "admin")
    {
        next()
    }
    else
    {
        res.redirect("/");
    }
} 