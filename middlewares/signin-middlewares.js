const { checkEmail, comparePassword, checkUserStatus} = require("../controllers/controllers");
const User = require("../models/users-schema");

module.exports = {
   isUserExist:(path)=>{ 
        return (req,res,next)=>{
        checkEmail(req.body.email)
        .then((user)=>{
            user ? next() : res.render(path,{err:"Email address doesn't exist, Please enter a valid email"});
        })
    }
},
    authPassword:(req,res,next)=>{
        comparePassword(req.body.password,req.body.email)
        .then((response)=>{
            req.session.user = req.body.email;
            if(response){
                res.redirect('/')
            }else{
                res.render('user-signin',{err:'Incorrect password please try again'})
            }
        })
    },
    userStatus:(req,res,next)=>{
        checkUserStatus(req.body.email).then((response)=>{
            response.status == true ? res.render('user-signin',{err:`Account is blocked kindly contact admin`})
            : next();
        })
    },
    getCartCount:async(req,res,next)=>{
        var session = req.session;
        if(req.session.user){
                let email = req.session.user;
            let user = await User.findOne({email:email});
            console.log(user);
            let cartExists = await user.cart.length;
            if(cartExists>0){
            session.totalQty = cartExists;
            }
            next()
        }else{
            next()
        }
        
    },
    isBlocked:async(req,res,next)=>{
        if(req.session.user){
            let email = req.session.user;
            let dbUser = await User.findOne({email:email});
            if(dbUser.status==true){
                res.render('user-signin',{err:'Your account is blocked, Kindly contact admin'});
            }else{
                next();
            }
        }else{
            next()
        }
    }
}