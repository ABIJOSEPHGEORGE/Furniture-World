module.exports = {
  userAuth: (req, res, next) => {
    if (req.session.user) {
      res.redirect("/");
    } else {
      next();
    }
  },
  userSession: (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      res.status(401).redirect("/users/signin");
    }
  },
  sessionDestroyUser: (req, res) => {
    req.session.destroy();
    res.redirect("/users/signin");
  },
};
