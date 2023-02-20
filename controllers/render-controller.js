const Banner = require("../models/banner");
const Category = require("../models/category-schema");
const Product = require("../models/products-schema");

module.exports = {
  signupPage: (req, res) => {
    res.render("user-signup");
  },
  signinPage: (req, res) => {
    res.render("user-signin");
  },
  otpPage: (req, res) => {
    res.render("verify-otp");
  },
  verifySignin: (req, res) => {
    res.render("verify-signin");
  },
  forgetPassPage: (req, res) => {
    res.render("forget-password");
  },
  resetPassPage: (req, res) => {
    req.app.locals.email = req.body.email;
    res.render("reset-password");
  },
  homePage: async (req, res) => {
    let banners = await Banner.find({});
    let categories = await Category.find({});
    let products = await Product.find({}).limit(50);
    res.render("home", {
      banners: banners,
      categories: categories,
      products: products,
    });
  },
};
