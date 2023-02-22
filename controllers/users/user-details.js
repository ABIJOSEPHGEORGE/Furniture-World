const { update } = require("../../models/users-schema");
const User = require("../../models/users-schema");
const mongoose = require("mongoose");
const Order = require("../../models/order-schema");
const bcrypt = require("bcrypt");

module.exports = {
  addNewAddrss: async (req, res) => {
    User.findOneAndUpdate(
      { email: req.session.user },
      { $push: { address: req.body } }
    )
      .then((result) => {
        res.json(true);
      })
      .catch((err) => {
        res.json(false);
      });
  },
  fetchAllAddrss: (req, res) => {
    User.findOne({ email: req.session.user })
      .then((data) => {
        return res.json(data.address);
      })
      .catch((err) => {
        return res.json(false);
      });
  },
  singleAddress: async (req, res) => {
    User.findOne({ email: req.session.user })
      .then(async (data) => {
        const address = data.address.filter((ele) => {
          if (ele._id == req.params.id) {
            return ele;
          }
        });
        return res.json(address);
      })
      .catch((err) => {
        res.json(false);
      });
  },
  updateAddress: async (req, res) => {
    const id = req.params.id;
    User.updateOne(
      { email: req.session.user, "address._id": id },
      { $set: { "address.$": req.body } }
    )
      .then((data) => {
        res.json(true);
      })
      .catch((err) => {
        res.redirect("/users/page-not-found");
      });
  },
  // deleting the address
  deleteAddress: (req, res) => {
    User.updateOne(
      { email: req.session.user },
      { $pull: { address: { _id: req.params.id } } }
    )
      .then((data) => {
        res.json(true);
      })
      .catch((err) => {
        res.status(500).json(false);
      });
  },

  // user dashboard
  profilePage: (req, res) => {
    res.render("user-profile");
  },

  // getting the user details
  fetchUserDetails: async (req, res) => {
    User.findOne({ email: req.session.user })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.json(false);
      });
  },
  updateProfile: async (req, res) => {
    let data = req.body;
    //checking email already exist with another user
    if (req.body.email) {
      try {
        let isExist = await User.findOne({ email: req.body.email });
        if (isExist) {
          return res.json({ err: "Email already exist try another" });
        }
      } catch (err) {
        res.redirect("/users/page-not-found");
      }
    }
    User.findOneAndUpdate({ email: req.session.user }, data, { new: true })
      .then((data) => {
        req.session.user = data.email;
        res.json(true);
      })
      .catch((err) => {
        res.redirect("/users/page-not-found");
      });
  },
  // getting user specified orders
  getOrders: async (req, res) => {
    try {
      let user = await User.findOne({ email: req.session.user });
      let orders = await Order.find({ userId: user._id }).sort({
        order_date: -1,
      });
      res.json(orders);
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  singleOrder: async (req, res) => {
    try {
      let orderDetails = await Order.findOne({ _id: req.params.id }).populate(
        "userId"
      );
      res.render("order-details", { order: orderDetails });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  resetPassword: async (req, res) => {
    try {
      let user = await User.findOne({ email: req.session.user });
      bcrypt.compare(req.body.old_password, user.password, (err, result) => {
        if (result == false) {
          return res.json({ err: "Incorrect Old Password" });
        }
      });
      if (req.body.new_password !== req.body.confirm_new_password) {
        return res.json({
          err: "New Password and Confirm New Password should match",
        });
      } else {
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(req.body.new_password, salt);
        if (hash) {
          await User.findOneAndUpdate(
            { email: user.email },
            { password: hash },
            { new: true }
          );
          return res.json(true);
        } else {
          return res.json({ err: "Something went wrong try after sometimes" });
        }
      }
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  // loading wallet balance
  walletBalance: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.session.user });
      const wallet_balance = user.wallet_balance;
      res.status(200).json({ balance: wallet_balance });
    } catch (err) {
      res.status(500).json(false);
    }
  },
  // canceling the order and refunding the amount to wallet
  cancelOrder: async (req, res) => {
    const orderId = req.params.id;
    try {
      // getting the order bill amount
      const dbOrder = await Order.findOne({ _id: orderId });
      const bill_amount = dbOrder.bill_amount;
      // updating the order status
      await Order.findByIdAndUpdate(orderId, { status: "canceled" });
      if(dbOrder.payment_method==="cod"){
        return res.json({method:"cod",status:true})
      }else{
        // crediting the bill amount to user wallet
        await User.findOneAndUpdate(
          { email: req.session.user },
          { $inc: { wallet_balance: parseInt(bill_amount) } }
        );
        res.status(200).json(true);
      }
      
    } catch (err) {
      res.status(500).json(false);
    }
  },
  // Handling order return and refund
  returnOrder: async (req, res) => {
    const orderId = req.params.id;
    try {
      // getting the order bill amount
      const dbOrder = await Order.findOne({ _id: orderId });
      const bill_amount = dbOrder.bill_amount;
      // updating the order status
      await Order.findByIdAndUpdate(orderId, { status: "return" });
      // crediting the bill amount to user wallet
      await User.findOneAndUpdate(
        { email: req.session.user },
        { $inc: { wallet_balance: parseInt(bill_amount) } }
      );
      res.status(200).json(true);
    } catch (err) {
      res.status(500).json(false);
    }
  },
};
