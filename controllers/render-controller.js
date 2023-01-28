const Banner = require("../models/banner");

module.exports = {
    signupPage:(req,res)=>{
        res.render('user-signup');
    },
    signinPage:(req,res)=>{
        res.render('user-signin')
    },
    otpPage:(req,res)=>{
        res.render('verify-otp');
    },
    forgetPassPage:(req,res)=>{
        res.render('forget-password');
    },
    resetPassPage:(req,res)=>{
        req.app.locals.email = req.body.email;
        res.render('reset-password');
    },
    homePage:(req,res)=>{
        Banner.find({}).then((banners)=>{
            res.render('home',{banners:banners})
        })
    }
}