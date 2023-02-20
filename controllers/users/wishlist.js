const { response } = require("express");
const Product = require("../../models/products-schema");
const User = require("../../models/users-schema");

module.exports = {
  wishlistPage: (req, res) => {
    res.render("wishlist");
  },
  addToWishlist: async (req, res) => {
    if (!req.session.user) {
      return res.status(401).json("unauthorized");
    }
    let prodId = req.params.id;
    let userEmail = req.session.user;
    try {
      let response = await User.findOneAndUpdate(
        { email: userEmail },
        { $addToSet: { wishlist: prodId } }
      );
      if (response) {
        return res.json(true);
      } else {
        return res.json(false);
      }
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  viewWishlist: async (req, res) => {
    try {
      let user = await User.findOne({ email: req.session.user });
      let wishlisted = await Promise.all(
        user.wishlist.map(async (ele) => {
          return await Product.findOne({ _id: ele });
        })
      );
      res.status(200).json({ items: wishlisted });
    } catch (err) {
      res.status(500).json(false);
    }
  },
  removeFrmWishlist: async (req, res) => {
    try {
      let prodId = req.params.id;
      let response = await User.updateOne(
        { email: req.session.user },
        { $pull: { wishlist: prodId } }
      );
      if (response) {
        return res.status(200).json(true);
      }
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  wishlistToCart: async (req, res) => {
    //add to cart
    let userEmail = req.session.user;
    let prodId = req.params.id;
    try {
      let dbUser = await User.findOne({ email: userEmail });
      //check whether item already existing
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
        await User.updateOne(
          { email: req.session.user },
          { $pull: { wishlist: prodId } }
        );
        res.status(200).json(true);
      } else {
        await User.findOneAndUpdate(
          { email: userEmail, "cart.productId": prodId },
          { $inc: { "cart.$.quantity": 1 } },
          { new: true }
        );
        await User.updateOne(
          { email: req.session.user },
          { $pull: { wishlist: prodId } }
        );
        res.status(200).json(true);
      }
    } catch (err) {
      res.status(500).json(false);
    }
  },
};
