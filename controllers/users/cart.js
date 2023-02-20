const Product = require("../../models/products-schema");
const { findOne } = require("../../models/users-schema");
const User = require("../../models/users-schema");
const mongoose = require("mongoose");

module.exports = {
  cartPage: (req, res) => {
    res.render("cart");
  },
  addToCart: async (req, res) => {
    let userEmail = req.session.user;
    let prodId = req.params.id;
    try {
      let dbUser = await User.findOne({ email: userEmail });
      //check wheather item already existing
      let prodExist = dbUser.cart.reduce((acc, curr) => {
        return curr.productId.toString() === prodId ? (acc = 1) : (acc = 0);
      }, 0);
      if (prodExist === 0) {
        let item = {
          productId: prodId,
          quantity: 1,
        };

        let response = await User.findOneAndUpdate(
          { email: userEmail },
          { $push: { cart: item } }
        );
        if (response) res.status(200).json(true);
      } else {
        await User.findOneAndUpdate(
          { email: userEmail, "cart.productId": prodId },
          { $inc: { "cart.$.quantity": 1 } },
          { new: true }
        );
        res.status(200).json(true);
      }
    } catch (err) {
      res.status(500).json(false);
    }
  },
  getCartQty: async (req, res) => {
    let userEmail = req.session.user;
    try {
      let dbUser = await User.findOne({ email: userEmail });
      let count = dbUser.cart.reduce((acc, curr) => {
        acc = acc + curr.quantity;
        return acc;
      }, 0);
      return res.json(count);
    } catch (err) {
      res.json(err);
    }
  },
  viewCart: async (req, res) => {
    let userEmail = req.session.user;
    try {
      let dbUser = await User.findOne({ email: userEmail });
      let products = await Promise.all(
        dbUser.cart.map(async (ele) => {
          let dbprodct = await Product.findOne({ _id: ele.productId });
          let items = {
            item: dbprodct,
            qty: ele.quantity,
            totalPrice: ele.quantity * dbprodct.sale_price,
          };
          return items;
        })
      );
      //calculating sub total
      let subTotal = products.reduce((acc, curr) => {
        acc = acc + curr.totalPrice;
        return acc;
      }, 0);
      // res.render("cart", { products: products, subTotal: subTotal });
      res.status(200).json({ products: products, subTotal: subTotal });
    } catch (err) {
      res.status(500).json(err);
    }
  },
  cartQuantity: async (req, res) => {
    let prodId = req.params.id;
    let status = req.params.st;
    let userEmail = req.session.user;
    let stockStatus = await stockChecking(prodId, status, req);
    if (stockStatus === false) {
      return res.status(200).json({ stock: false });
    }
    try {
      if (status === "inc") {
        let response = await User.findOneAndUpdate(
          { email: userEmail, "cart.productId": prodId },
          { $inc: { "cart.$.quantity": 1 } },
          { new: true }
        );
        let products = await Promise.all(
          response.cart.map(async (ele) => {
            let dbprodct = await Product.findOne({ _id: ele.productId });
            let items = {
              item: dbprodct,
              qty: ele.quantity,
              totalPrice: ele.quantity * dbprodct.sale_price,
            };
            return items;
          })
        );
        //calculating sub total
        let subTotal = products.reduce((acc, curr) => {
          acc = acc + curr.totalPrice;
          return acc;
        }, 0);
        res
          .status(200)
          .json({ cart: products, subTotal: subTotal, stock: true });
      } else {
        let response = await User.findOneAndUpdate(
          { email: userEmail, "cart.productId": prodId },
          { $inc: { "cart.$.quantity": -1 } },
          { new: true }
        );

        let products = await Promise.all(
          response.cart.map(async (ele) => {
            let dbprodct = await Product.findOne({ _id: ele.productId });
            let items = {
              item: dbprodct,
              qty: ele.quantity,
              totalPrice: ele.quantity * dbprodct.sale_price,
            };
            return items;
          })
        );
        //calculating sub total
        let subTotal = products.reduce((acc, curr) => {
          acc = acc + curr.totalPrice;
          return acc;
        }, 0);
        res
          .status(200)
          .json({ cart: products, subTotal: subTotal, stock: true });
      }
    } catch (err) {
      res.status(500).json(false);
    }
  },
  removeItem: async (req, res) => {
    let prodId = req.params.id;
    let userEmail = req.session.user;
    try {
      let response = await User.updateOne(
        { email: userEmail },
        { $pull: { cart: { productId: prodId } } }
      );
      if (response) {
        return res.status(200).json(true);
      }
    } catch (err) {
      res.status(500).json(false);
    }
  },
};

async function stockChecking(id, status, req) {
  try {
    let response = await User.findOne({ email: req.session.user });

    let cartQty = await Promise.all(
      response.cart.map(async (ele) => {
        if (ele.productId == id) {
          return ele.quantity;
        }
      })
    );

    let product = await Product.findOne({ _id: id });
    let stock = product.stock;
    if (status == "inc") {
      let incStock = parseInt(cartQty) + 1;

      if (incStock > stock) {
        return false;
      } else {
        return true;
      }
    } else if (status == "dec") {
      let decStock = parseInt(cartQty) - 1;
      if (stock < decStock) {
        return false;
      } else {
        return true;
      }
    }
  } catch (err) {
    res.redirect("/users/page-not-found");
  }
}
