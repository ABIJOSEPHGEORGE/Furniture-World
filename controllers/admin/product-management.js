const Category = require("../../models/category-schema");
const Product = require("../../models/products-schema");
const { multipleUpload } = require("../../services/cloudinary");

module.exports = {
  addProductPage: async (req, res) => {
    try {
      let parentCategories = await Category.find({});
      let subcategories = await Category.find({});
      res.render("add-product", {
        parent: parentCategories,
        sub: subcategories.sub_category,
      });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  // getting all parent categories to render in add product page
  allCategories: async (req, res) => {
    try {
      let response = await Category.find({});
      let categories = await Promise.all(
        response.map((ele) => {
          return {
            category_name: ele.category_name,
            category_id: ele._id,
          };
        })
      );
      return res.json(categories);
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  // getting all the sub categories based on user parent category selection
  allSubcategories: async (req, res) => {
    try {
      let response = await Category.find({});
      let subcategory = await Promise.all(
        response.map((ele) => {
          return ele.sub_category;
        })
      );
      res.json(subcategory);
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  // creating new product
  createProduct: async (req, res) => {
    let imageFiles = req.files;
    try {
      let response = await multipleUpload(imageFiles);
      let product = {
        product_name: req.body.product_name,
        description: req.body.product_description,
        parent_category: req.body.parent_category,
        sub_category: req.body.sub_category.replaceAll(" ", "-").toLowerCase(),
        stock: req.body.stock,
        status: req.body.status,
        measurements: {
          width: req.body.width,
          height: req.body.height,
          depth: req.body.depth,
          max_load: req.body.max_load,
        },
        price: req.body.price,
        sale_price: req.body.sale_price,
        images: response,
      };
      let dbProduct = await Product.create(product);
      if (dbProduct) res.redirect("/admin/product-management");
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  // getting all products
  fetchAllProduct: async (req, res) => {
    try {
      let products = await Product.find({}).populate([
        "parent_category",
        "sub_category",
      ]);
      if (products) return products;
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  // view single product
  viewProduct: async (req, res) => {
    let productId = req.query.id;
    try {
      let product = await Product.findById(productId).populate(
        "parent_category"
      );

      if (product) {
        res.render("view-product", { product: product });
      }
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  //list or unlist products
  updateStatus: async (req, res) => {
    let status = req.query.status;
    let productId = req.params.id;
    try {
      let response = await Product.findOneAndUpdate(
        { _id: productId },
        { status: status }
      );
      if (response) res.redirect("/admin/product-management");
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  // rendering edit product page
  editProductPage: async (req, res) => {
    let productId = req.query.id;
    try {
      let response = await Product.findOne({ _id: productId }).populate([
        "parent_category",
      ]);
      if (response) res.render("edit-product", { product: response });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  // updating product details
  updateProduct: async (req, res) => {
    let prodId = req.params.id;
    try {
      if (req.file !== undefined) {
        let imageFiles = req.files;
        let response = await multipleUpload(imageFiles);
        await Product.findOneAndUpdate(
          { _id: prodId },
          { $set: { images: response } }
        );
      }
      // fetching existing images array
      let productdb = await Product.findOne({ _id: prodId });
      let category = await Category.findOne({
        category_name: req.body.parent_category.replaceAll(" ", "-"),
      });
      let dbimages = productdb.images;
      let product = {
        product_name: req.body.product_name,
        description: req.body.product_description,
        sub_category: req.body.sub_category.replaceAll(" ", "-").toLowerCase(),
        parent_category: category._id,
        stock: req.body.stock,
        status: req.body.status,
        measurements: {
          width: req.body.width,
          height: req.body.height,
          depth: req.body.depth,
          max_load: req.body.max_load,
        },
        images: dbimages,
      };
      let dbProduct = await Product.findOneAndUpdate({ _id: prodId }, product);
      res.redirect("/admin/product-management");
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  // deleting product
  deleteProduct: async (req, res) => {
    let productId = req.params.id;
    try {
      let response = await Product.findByIdAndDelete(productId);
      if (response) res.redirect("/admin/product-management");
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  // getting all categories and default category for product editing
  fetchCategories: async (req, res) => {
    try {
      const prodId = await req.params.id;
      let all_categories = await Category.find({});
      let product = await Product.find({ _id: prodId }).populate(
        "parent_category"
      );
      let parent_category = product[0].parent_category.category_name;
      res
        .status(200)
        .json({
          categories: all_categories,
          default_category: parent_category,
          default_sub_category: product[0].sub_category,
        });
    } catch (err) {
      res.redirect("/users/page-not-found");
    }
  },
  // update sub category for unlisted products
  updateProductSub: async (req, res) => {
    try {
      await Product.findOneAndUpdate(
        { _id: req.params.id },
        { sub_category: req.query.sub, status: true }
      );
      res.status(200).json(true);
    } catch (err) {
      res.status(500).json(false);
    }
  },
};
