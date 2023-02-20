module.exports = {
  authSession: (req, res, next) => {
    if (req.session.admin) {
      res.redirect("/admin/admin-dashboard");
    } else {
      next();
    }
  },
  sessionAdmin: (req, res, next) => {
    if (req.session.admin) {
      next();
    } else {
      res.redirect("/admin");
    }
  },
  sessionDestroyAdmin: (req, res) => {
    req.session.destroy();
    res.redirect("/admin");
  },
};
