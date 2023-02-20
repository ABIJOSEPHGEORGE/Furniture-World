const User = require("../models/users-schema");
const bcrypt = require("bcrypt");
const Category = require("../models/category-schema");

module.exports = {
  checkEmail: async (email) => {
    let dbUser = await User.findOne({ email: email });
    return dbUser;
  },

  comparePassword: async (password, email) => {
    let user = await User.findOne({ email: email });
    let checkPassword = await bcrypt.compare(password, user.password);
    if (checkPassword) {
      return true;
    }
  },
  validatePassword: (password, confirmPassword) => {
    if (password === confirmPassword) {
      return true;
    } else {
      return false;
    }
  },
  updatePassword: async (req, res) => {
    let filter = { email: req.app.locals.email };
    let salt = await bcrypt.genSalt(10);
    try {
      let password = await bcrypt.hash(req.body.password, salt);
      await User.findOneAndUpdate(filter, { password: password });
      req.app.locals.email = null;
      res.redirect("/users/signin");
    } catch (err) {
      res.render("forget-password", {
        err: "Error in resetting password, Try after sometimes",
      });
    }
  },
  createUser: async (req, res) => {
    let user = req.app.locals.user;
    let salt = await bcrypt.genSalt(10);
    try {
      user.password = await bcrypt.hash(user.password, salt);
      await User.create(user);
      req.session.user = user.email;
      res.redirect("/");
    } catch (err) {
      res.render("user-signup", {
        err: "Error creating new account try after sometimes",
      });
    }
  },
  checkUserStatus: async (email) => {
    try {
      let user = await User.findOne({ email: email });
      return user;
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  homeUser: (req, res) => {
    req.session.user = req.session.temp;
    res.redirect("/");
  },
};
