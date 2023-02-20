const Banner = require("../../models/banner");
const { singleCoupon } = require("./coupon-management");
const { fetchAllProduct } = require("./product-management");
const { searchUserCntrlr } = require("./user-management");

module.exports = {
  signinPage: (req, res) => {
    req.session.admin = req.body.email;
    res.render("admin-signin");
  },

  searchUser: (req, res) => {
    searchUserCntrlr(req.body.search_key).then((users) => {
      if (users) {
        res.render("user-management", { users: users });
      } else {
        res.render("user-management", { users: false });
      }
    });
  },
  addCouponForm: (req, res) => {
    res.render("add-coupon");
  },
  editCouponPage: (req, res) => {
    singleCoupon(req.query.id).then((response) => {
      res.render("edit-coupon", { coupon: response });
    });
  },
  addProductPage: (req, res) => {
    res.render("add-product");
  },
  addCategoryPage: (req, res) => {
    res.render("add-category");
  },
  addBannerPage: (req, res) => {
    res.render("add-banner");
  },
  editBannerPage: async (req, res) => {
    let bannerId = req.query.id;
    await Banner.findOne({ _id: bannerId }).then((response) => {
      res.render("edit-banner", { banner: response });
    });
  },
  productManagementPage: (req, res) => {
    fetchAllProduct(req, res).then((response) => {
      res.render("product-management", { products: response });
    });
  },
};
