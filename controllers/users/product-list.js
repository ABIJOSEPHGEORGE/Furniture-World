const Category = require("../../models/category-schema");
const Product = require("../../models/products-schema");
const User = require("../../models/users-schema");

module.exports = {
  sortProducts: async (req, res) => {
    try {
      const category = await Category.findOne({ category_name: req.params.id });
      if (!category) {
        return res.status(404).json({ status: false });
      }
      const all_sub_categories = category.sub_category;
      const search_key = req.query.search_key;
      let page;
      if (req.query.p == "undefined" || req.query.p == undefined) {
        page = 1;
      } else {
        page = parseInt(req.query.p);
      }
      const productPerPage = 4;
      let sort;
      if (req.query.sort == "undefined" || req.query.sort == undefined) {
        sort = 1;
      } else {
        sort = parseInt(req.query.sort);
      }

      let [products, totalProducts] = await fetchProducts(
        req.query.sub,
        category._id,
        page,
        productPerPage,
        req.query.price,
        sort,
        search_key
      );

      let wishlistProducts = await existInWishlist(products, req.session.user);

      if (totalProducts == undefined) {
        return res.json(false);
      } else {
        let response = {
          category: req.params.id,
          products: wishlistProducts,
          allSubCategories: all_sub_categories,
          totalProducts: totalProducts,
          currentPage: page,
          hasNextPage: productPerPage * page < totalProducts.totalCount,
          nextPage: parseInt(page) + 1,
          lastPage: Math.ceil(totalProducts.totalCount / productPerPage),
        };

        res.status(200).json(response);
      }
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
};

fetchProducts = async (
  subcategory_name,
  categoryId,
  page,
  productPerPage,
  price,
  sort,
  search_key
) => {
  let categoryFilter;
  let statusFilter = { status: true };
  let priceFilter;
  if (price === "undefined" || price === undefined) {
    priceFilter = {};
  } else {
    let priceGreater = parseInt(price.split("-")[0]);
    let priceLess = parseInt(price.split("-")[1]);
    !priceLess
      ? (priceFilter = { sale_price: { $gt: priceGreater } })
      : (priceFilter = { sale_price: { $gt: priceGreater, $lt: priceLess } });
  }

  let searchFilter = {};
  if (search_key !== "null") {
    searchFilter = {
      $or: [{ product_name: { $regex: String(search_key), $options: "i" } }],
    };
  }

  parentCatFilter = { parent_category: categoryId };
  subcategory_name == "undefined" ||
  subcategory_name == undefined ||
  subcategory_name === "All"
    ? (categoryFilter = {})
    : (categoryFilter = { sub_category: subcategory_name });

  try {
    let products = await Product.aggregate([
      {
        $match: {
          $and: [
            categoryFilter,
            parentCatFilter,
            statusFilter,
            priceFilter,
            searchFilter,
          ],
        },
      },
      { $sort: { sale_price: sort } },
      { $skip: (page - 1) * productPerPage },

      { $limit: productPerPage },
    ]);
    let totalCount = await Product.aggregate([
      {
        $match: {
          $and: [
            categoryFilter,
            parentCatFilter,
            statusFilter,
            priceFilter,
            searchFilter,
          ],
        },
      },
      { $count: "totalCount" },
    ]);
    const totalProducts = totalCount.find((obj) => {
      return obj;
    });
    return [products, totalProducts];
  } catch (err) {
    res.redirect("/users/page-not-found");
  }
};

async function existInWishlist(products, email) {
  if (typeof email === "undefined") {
    return products;
  } else {
    try {
      let user = await User.findOne({ email: email });
      let wishlist = user.wishlist;
      products = products.map((product) => {
        if (wishlist.includes(product._id)) {
          product.wishlist = true;
        } else {
          product.wishlist = false;
        }
        return product;
      });
      return products;
    } catch (err) {
      console.error(err);
    }
  }
}
