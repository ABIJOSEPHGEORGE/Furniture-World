const { checkEmail, validatePassword, getEmail } = require("../controllers/controllers");
const { generateOtp, resendOtp } = require("../services/email-otp");
var generatedOtp;
var otpemail;


module.exports = {
    validateUser:(req,res,next)=>{
        checkEmail(req.body.email)
        .then((user)=>{
            if(user){
                return res.render('user-signup',{err:'Email address already exist'});
            }else{
                next();
            }
        })
    },
    checkPassword:(path)=>{
        return async(req,res,next)=>{
            let status = await validatePassword(req.body.password,req.body.confirm_password);
            status ? next() : res.render(path,{err:'Password and Confirm Password should match'});
        }
    },
    generateOtp:(req,res,next)=>{
        otpemail=req.body.email;
        generateOtp(req.body.email)
        .then((response)=>{
            generatedOtp = response.otp;
            console.log(generatedOtp);
            response.otp ? next() : res.render('user-signup',{err:'Error in generating otp, Try after sometimes'})
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    
    verifyOtp:(path)=>{
        return (req,res,next)=>{
        const inputOtp = req.body.verify_otp;
        console.log(generatedOtp,inputOtp);
        inputOtp == generatedOtp ? next() : res.render(path,{err:'Invalid otp try again'});
    }
},
    userObj:async(req,res,next)=>{
        let userObject = await {
            first_name : req.body.first_name,
            last_name : req.body.last_name,
            email : req.body.email,
            phone : req.body.phone,
            password : req.body.password,
            email_verified:true,
            joined_at: new Date().getTime(),
        }
        req.app.locals.user = userObject;
        next();
    },
    regenerateOtp:(req,res,next)=>{
        resendOtp(otpemail)
        .then((response)=>{
            generatedOtp = response.otp;
            console.log(generatedOtp);
            response.otp ? next() : res.render('user-signup',{err:'Error in generating otp, Try after sometimes'})
        })
    }

}