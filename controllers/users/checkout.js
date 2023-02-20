const { couponName } = require("../../middlewares/admin/admin-middlewares");
const Coupon = require("../../models/coupon-schema");
const Order = require("../../models/order-schema");
const Product = require("../../models/products-schema");
const User = require("../../models/users-schema");
const Razorpay = require("razorpay");

//initializing razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEYID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = {
  // rendering the checkout page
  checkOutPage: (req, res) => {
    res.render("checkout-page");
  },
  checkoutItems: async (req, res) => {
    // checking user status and user logged in or not
    if (!req.session.user) {
      return res.status(401).json({ status: false, msg: "unauthorized" });
    }

    //getting the cart item and calculating the total price
    try {
      const cartItems = await User.findOne({ email: req.session.user }).then(
        (data) => {
          return data.cart;
        }
      );
      // getting each product totalPrice
      let cartPrdcts = await Promise.all(
        cartItems.map(async (ele) => {
          let dbprodct = await Product.findOne({ _id: ele.productId });
          let items = {
            item: dbprodct,
            qty: ele.quantity,
            totalPrice: ele.quantity * dbprodct.sale_price,
          };
          return items;
        })
      );
      // calculating the cart subTotal
      let cartTotal = cartPrdcts.reduce((acc, curr) => {
        acc = acc + curr.totalPrice;
        return acc;
      }, 0);
      req.session.cartItems = cartPrdcts;
      req.session.cartTotal = cartTotal;
      res
        .status(200)
        .json({ products: cartPrdcts, subTotal: req.session.cartTotal });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  //applying coupon in checkout page
  applyCoupon: async (req, res) => {
    if (!req.session.user) {
      return res
        .status(401)
        .json({ status: false, msg: "Please login to continue" });
    }
    const couponName = req.params.coupon.toUpperCase();

    try {
      let dbCoupon = await Coupon.findOne({ coupon_id: couponName });
      // checking coupon exist
      if (!dbCoupon) {
        return res.json({ status: false, msg: "Invalid Coupon" });
      }
      //checking coupon status

      if (dbCoupon.status === false) {
        return res.json({ status: false, msg: "Invalid Coupon" });
      }
      // checking coupon expiry data
      const today = new Date().toISOString().slice(0, 10);

      if (dbCoupon.expiry_date.toISOString().slice(0, 10) < today) {
        return res.json({ status: false, msg: "Coupon Expired" });
      }
      // checking coupon minimum purchase
      const purchaseAmount = req.session.cartTotal;
      if (purchaseAmount < dbCoupon.minimum_purchase) {
        return res.json({
          status: false,
          msg: `Minimum purchase for ${couponName} should be ${dbCoupon.minimum_purchase}`,
        });
      }
      // checking users allowed for this coupon
      if (dbCoupon.user_allowed <= 0) {
        return res.json({ status: false, msg: "Invalid Coupon" });
      }
      // applying coupon amount to sub total
      req.session.cartTotal = req.session.cartTotal - dbCoupon.discount;
      req.session.couponDetails = {
        coupon: couponName,
        discount: dbCoupon.discount,
      };
      return res.json({
        status: true,
        couponName: couponName,
        subTotal: req.session.cartTotal,
        couponDiscount: dbCoupon.discount,
      });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  clearCoupon: async (req, res) => {
    let couponName = req.params.coupon;
    // finding the coupon details
    try {
      let coupon = await Coupon.findOne({
        coupon_id: couponName.toUpperCase(),
      });
      let couponAmount = coupon.discount;
      // decreasing the coupon amount from the sub total
      req.session.cartTotal = req.session.cartTotal + couponAmount;
      req.session.couponDetails = {};
      return res.json({ status: true, subTotal: req.session.cartTotal });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },

  // razorpay create order
  createOrder: async (req, res) => {
    const amount = req.params.amount;
    let dbOrderId = await dbOrder(req);
    // Handling cod order
    if (req.body.payment === "cod") {
      res.json({ status: dbOrderId });
    } else if (req.body.payment == "wallet") {
      res.json({ status: dbOrderId });
    } else {
      // Handling online payment using razorpay
      razorpay.orders.create(
        {
          amount: amount * 100,
          currency: "INR",
          payment_capture: 1,
        },
        function (err, order) {
          res.json({ orderId: order.id, dbOrderId: dbOrderId });
        }
      );
    }
  },
  confirmOrder: async (req, res) => {
    try {
      // fetching the order details
      let dbOrder = await Order.findOne({ _id: req.params.id });
      // updating the order status
      dbOrder.status = "processing";
      dbOrder.save();
      // clearing the user cart
      await User.findByIdAndUpdate(
        { _id: dbOrder.userId },
        { $set: { cart: [] } }
      );
      // updating the product stock
      dbOrder.products.forEach(async (prdct) => {
        // AVOIDING STOCK GETTING UPDATED TO NEGATIVE VALUE
        for (let i = 1; i <= prdct.qty; i++) {
          let stock = await Product.findById(prdct.item._id).then(
            (data) => data.stock
          );

          if (stock > 0) {
            await Product.findOneAndUpdate(
              { _id: prdct.item._id },
              { $inc: { stock: -i } },
              { new: true }
            );
          }
        }
      });
      // clearing the coupon details from the session if previously applied
      req.session.couponDetails = null;
      // updating the wallet balance if applied
      if (req.session.walletStatus == true) {
        if (req.session.wallet_update === true) {
          await User.findOneAndUpdate(
            { email: req.session.user },
            { $inc: { wallet_balance: -req.session.wallet_discount } },
            { new: true }
          );
        } else if (req.session.wallet_update === false) {
          await User.findOneAndUpdate(
            { email: req.session.user },
            { wallet_balance: 0 },
            { new: true }
          );
        }
        req.session.walletApplied = null;
        req.session.walletStatus = null;
        req.session.wallet_discount = null;
        req.session.wallet_update = null;
      }

      // updating the coupon user allowed and users claimed
      await Coupon.findOneAndUpdate(
        { coupon_id: dbOrder.coupon },
        { $inc: { claimed_users: 1, user_allowed: -1 } }
      );
      // res.render('/order-confirmation',{dbOrder});
      res.render("order-confirmation", { order: dbOrder });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  stockChecking: async (req, res) => {
    // fetching the cart Items
    let cartItems = await User.findOne({ email: req.session.user }).then(
      (data) => {
        return data.cart;
      }
    );
    // checking the product stock
    let stcokStatus = await Promise.all(
      cartItems.map(async (ele) => {
        let dbprodct = await Product.findOne({ _id: ele.productId });
        if (dbprodct.stock === 0 || dbprodct.stock < ele.quantity) {
          return {
            status: false,
            msg: `${dbprodct.product_name} is out of stock`,
            id: dbprodct._id,
          };
        } else {
          return {
            status: true,
          };
        }
      })
    );
    res.send(stcokStatus);
  },
  applyWalletBalance: async (req, res) => {
    try {
      // fetching the wallet balance
      const user = await User.findOne({ email: req.session.user });
      const wallet_balance = user.wallet_balance;
      //getting the bill amount
      const bill_amount = req.session.cartTotal;
      // comparing the bill amount and the wallet balance
      if (wallet_balance >= bill_amount) {
        // making the bill amount 0
        req.session.walletApplied = req.session.cartTotal;
        req.session.cartTotal = 0;
        // updating the status in session

        req.session.walletStatus = true;
        req.session.wallet_discount = bill_amount;
        req.session.wallet_update = true;
        // decreasing the amount from wallet balance
        // await User.findOneAndUpdate({email:req.session.user},{$inc:{wallet_balance:-bill_amount}},{new:true});
        return res
          .status(200)
          .json({
            bill_amount: req.session.cartTotal,
            wallet_balance: wallet_balance,
            amount_applied: req.session.wallet_discount,
          });
      } else if (wallet_balance < bill_amount) {
        // decreasing the available wallet amount from bill_amount
        req.session.walletApplied = req.session.cartTotal;
        req.session.cartTotal = req.session.cartTotal - wallet_balance;
        // updating the status in session

        req.session.walletStatus = true;
        req.session.wallet_discount = wallet_balance;
        req.session.wallet_update = false;
        // updating the wallet balance
        // await User.findOneAndUpdate({email:req.session.user},{wallet_balance:0},{new:true});
        return res
          .status(200)
          .json({
            bill_amount: req.session.cartTotal,
            wallet_balance: wallet_balance,
            amount_applied: req.session.wallet_discount,
          });
      }
    } catch (err) {
      res.status(500).json(false);
    }
  },
};

// creating order details in database
async function dbOrder(req) {
  let billing_address = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    company_name: req.body.company_name,
    phone_number: req.body.phone_number,
    add_one: req.body.address_one,
    add_two: req.body.address_two,
    email: req.body.email,
    city: req.body.city,
    state: req.body.state,
    country: req.body.country,
    zip: req.body.zip,
  };
  try {
    // getting the userid
    let dbUser = await User.findOne({ email: req.session.user });
    const order = {
      userId: dbUser._id,
      billing_address: billing_address,
      bill_amount: req.params.amount,
      status: "pending",
      payment_method: req.body.payment,
      order_date: new Date(),
      payment_id: "",
      delivery_date: "",
      products: req.session.cartItems,
    };
    if (req.session.couponDetails != null) {
      order.coupon = req.session.couponDetails.coupon;
      order.coupon_discount = req.session.couponDetails.discount;
    } else {
      order.coupon = "Not Applied";
      order.coupon_discount = 0;
    }
    if (req.session.walletStatus === true && req.session.wallet_discount) {
      order.wallet_discount = req.session.wallet_discount;
    }
    let response = await Order.create(order);
    return response._id;
  } catch (err) {
    res.redirect("/users/page-not-found");
  }
}
