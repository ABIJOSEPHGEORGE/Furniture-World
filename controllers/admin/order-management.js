const Order = require("../../models/order-schema");

module.exports = {
  orderPage: (req, res) => {
    res.render("order-management");
  },
  orderMngmt: async (req, res) => {
    try {
      let orders = await Order.find({})
        .populate("userId")
        .sort({ order_date: -1 });
      res.json(orders);
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  invoice: async (req, res) => {
    try {
      // getting the order details
      let dbOrder = await Order.findOne({ _id: req.query.id });
      // calculating the total order amount without discount
      let totalAmount = dbOrder.products.reduce((acc, curr) => {
        acc = acc + curr.totalPrice;
        return acc;
      }, 0);
      res.render("view-invoice", { order: dbOrder, totalAmount: totalAmount });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  updateOrderStatus: async (req, res) => {
    try {
      // updating the order status
      Order.findByIdAndUpdate(
        req.params.id,
        { status: req.query.status },
        { new: true }
      ).then(() => {
        res.json(true);
      });
    } catch (err) {
      res.json(false);
    }
  },
  fetchOrderStatus: (req, res) => {
    try {
      Order.findById(req.params.id).then((data) => {
        res.json(data.status);
      });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
};
