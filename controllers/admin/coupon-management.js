const Coupon = require("../../models/coupon-schema");
module.exports = {
  isCouponExist: async (coupon_id) => {
    try {
      let coupon = await Coupon.findOne({ coupon_id: coupon_id });
      return coupon ? true : false;
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  addCoupon: async (req, res) => {
    try {
      await Coupon.create(req.body);
      res.redirect("/admin/coupon-management");
    } catch (err) {
      res.render("add-coupon", {
        err: "Error in creating new coupon try after sometimes",
      });
    }
  },
  allCoupons: async (req, res) => {
    try {
      let coupons = await Coupon.find({});
      res.render("coupon-management", { coupons: coupons, nodata: false });
    } catch (err) {
      res.render("coupon-management", { nodata: true });
    }
  },
  singleCoupon: async (id) => {
    try {
      let coupon = await Coupon.findOne({ ObjectId: id });
      // res.render('edit-coupon',{coupon:coupon})/
      return coupon;
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  updateCoupon: async (req, res) => {
    try {
      const dbCoupon = await Coupon.findOne({ _id: req.query.id });
      if (dbCoupon.coupon_id !== req.body.coupon_id) {
        let isExist = await Coupon.findOne({ coupon_id: req.body.coupon_id });
        if (isExist)
          return res.render("edit-coupon", {
            coupon: isExist,
            err: "Coupon name already exist",
          });
      }

      let filter = req.query.id;
      await Coupon.updateOne({ filter }, req.body);
      res.redirect("/admin/coupon-management");
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  listUnlistCoupon: (status) => {
    return async (req, res) => {
      Coupon.findByIdAndUpdate(req.params.id, { status: status }).exec(
        (err, user) => {
          if (err) res.redirect("/users/page-not-found");
          if (user) res.redirect("/admin/coupon-management");
        }
      );
    };
  },
  deleteCoupon: async (req, res) => {
    Coupon.findByIdAndDelete(req.params.id).exec((err, data) => {
      if (err) res.redirect("/users/page-not-found");
      if (data) res.redirect("/admin/coupon-management");
    });
  },
};
