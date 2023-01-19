const { checkEmail, comparePassword } = require("../../controllers/admin/admin-auth")

module.exports = {
    isAdminExist:(req,res,next)=>{
        checkEmail(req.body.admin_email)
        .then((user)=>{
            user ? next() : res.render('admin-signin',{err:`Email ID doesn't exist, Try again`})
        })
    },
    checkPassword:(req,res,next)=>{
        comparePassword(req.body.admin_password,req.body.admin_email)
        .then((response)=>{
            if(response){
                req.session.admin = req.body.admin_email;
                res.redirect('/admin/admin-dashboard');
            }else{
                res.render('admin-signin',{err:'Incorrect password try again'});
            }
        })
    }
}