const { checkEmail, comparePassword, checkUserStatus} = require("../controllers/controllers")

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
            response ? res.redirect('/') : res.render('user-signin',{err:'Incorrect password please try again'})
        })
    },
    userStatus:(req,res,next)=>{
        checkUserStatus(req.body.email).then((response)=>{
            response.status == true ? res.render('user-signin',{err:`Account is blocked kindly contact admin`})
            : next();
        })
    }
}