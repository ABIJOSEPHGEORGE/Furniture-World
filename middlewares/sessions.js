module.exports = {
  sessionHandler:(req,res,next)=>{
    if(req.session.user){
      next();
    }else{
      res.redirect('/users/sigin');
    }
  },
  AuthSession:(req,res,next)=>{
    if(req.session.user){
      res.redirect('/');
    }else{
      next();
    }
  },
  sessionDestroy:(req,res)=>{
    req.session.destroy();
    res.redirect('/users/signin');
  }
};

