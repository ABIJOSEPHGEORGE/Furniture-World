const {
  isCategoryExist,
  getCategoryImage,
} = require("../../controllers/admin/category-management");
const {
  isCouponExist,
  singleCoupon,
} = require("../../controllers/admin/coupon-management");
const {
  updateStatus,
  deleteUser,
  searchUserCntrlr,
} = require("../../controllers/admin/user-management");

module.exports = {
  requestMethod: (req, res, next) => {
    if (req.query._method == "PUT") {
      req.method = "PUT";
      req.url = req.path;
    } else if (req.query._method == "DELETE") {
      req.method = "DELETE";
      req.url = req.path;
    }
    next();
  },
  userStatus: (req, res, next) => {
    updateStatus(req.params.id, req.query.status).then((response) => {
      response
        ? res.redirect("/admin/user-management")
        : res.redirect("/users/page-not-found");
    });
  },
  deleteUser: (req, res, next) => {
    deleteUser(req.params.id).then((response) => {
      response
        ? res.redirect("/admin/user-management")
        : res.redirect("/users/page-not-found");
    });
  },
  checkCoupon: (req, res, next) => {
    isCouponExist(req.body.coupon_id).then((response) => {
      response == false
        ? next()
        : res.render("add-coupon", {
            err: `Coupon code already exist try another code`,
          });
    });
  },
  couponName: (req, res, next) => {
    isCouponExist(req.body.coupon_id).then((response) => {
      singleCoupon(req.body.coupon_id).then((coupon) => {
        response == false
          ? next()
          : res.render("edit-coupon", {
              err: "Coupon code already exist try another code",
              coupon: coupon,
            });
      });
    });
  },
};
