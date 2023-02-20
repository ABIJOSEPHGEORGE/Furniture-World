const Product = require("../../models/products-schema");
const User = require("../../models/users-schema");
const mongoose = require("mongoose");

module.exports = {
  fetchProduct: async (req, res) => {
    let productId = req.params.id;
    try {
      let dbproduct = await Product.find({ _id: productId }).populate(
        "parent_category"
      );

      let product = dbproduct.find((object) => {
        return object;
      });

      // checking whether item already exist in cart
      let cartExist;
      let wishlistExist;
      if (req.session.user) {
        const user = await User.findOne({ email: req.session.user });
        user.cart.forEach((ele) => {
          if (String(ele.productId) == productId) {
            cartExist = true;
          } else {
            cartExist = false;
          }
        });
        // checking whether the product exist in user wishlist
        user.wishlist.forEach((ele) => {
          if (String(ele) == productId) {
            wishlistExist = true;
          } else {
            wishlistExist = false;
          }
        });
      } else {
        cartExist = false;
        wishlistExist = false;
      }

      let parent = product.parent_category.category_name;
      res.render("product-detail", {
        product: product,
        parent: parent,
        cartExist: cartExist,
        wishlistExist: wishlistExist,
      });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  matchProduct: async (req, res) => {
    const search_key = req.params.search_key;
    const searchFilter = {
      product_name: { $regex: String(search_key), $options: "i" },
    };
    try {
      const products = await Product.find(searchFilter);
      res.json(products);
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
};
