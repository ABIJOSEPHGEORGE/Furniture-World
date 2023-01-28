const { default: mongoose } = require("mongoose");
const Category = require("../../models/category-schema");
const Product = require("../../models/products-schema");
const { multipleUpload } = require("../../services/cloudinary");

module.exports = {
  // getting all parent categories to render in add product page
  allCategories:async(req,res)=>{
    try{
      let response = await Category.find({});
      let categories = await Promise.all(response.map((ele)=>{
          return {
            category_name : ele.category_name,
            category_id : ele._id,
          }
      }))
      return res.json(categories);
    }catch(err){
      console.log(err);
    }
  },
  // getting all the sub categories based on user parent category selection
  allSubcategories:async(req,res)=>{
    try{
      let response = await Category.find({});
      let subcategory = await Promise.all(response.map((ele)=>{
        return ele.sub_category;
      }))
      res.json(subcategory)
    }catch(err){
      console.log(err);
    }
  },
  // creating new product
  createProduct: async (req, res) => {
    let imageFiles = req.files;
    try {
      let response = await multipleUpload(imageFiles);
      let product = await {
        product_name: req.body.product_name,
        description: req.body.product_description,
        parent_category: req.body.parent_category,
        sub_category: req.body.sub_category,
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
      if (dbProduct) res.redirect('/admin/product-management')
    } catch (err) {
      console.log(err);
      res.send("cant create product");
    }
  },
  // getting all products
  fetchAllProduct: async (req, res) => {
    try {
      let products = await Product.find({}).populate([
        "parent_category",
        "sub_category",
      ]);
      console.log(products);
      if (products) return products;
    } catch (err) {
      console.log(err);
      res.send("cant fetch products");
    }
  },
  // view single product
  viewProduct: async (req, res) => {
    let productId = req.query.id;
    try {
      let product = await Product.findById(productId).populate([
        "parent_category",
      ]);
      
      if (product) {
        res.render("view-product", { product: product});
      }
    } catch (err) {
      console.log(err);
      res.send("can't fetch product try after sometimes");
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
      console.log(err);
      res.send("can't update the status");
    }
  },
  // rendering edit product page
  editProductPage:async(req,res)=>{
    let productId = req.query.id;
    try{
        let response = await Product.findOne({_id:productId}).populate(['parent_category']);
        let parent_category = await response.parent_category.find((ele)=>{
          return ele.category_name;
        })
        if(response) res.render('edit-product',{product:response});
    }catch(err){
        console.log(err)
        res.send("Unable to fetch product");
    }
  },
  // updating product details
  updateProduct:async(req,res)=>{
      let prodId = req.params.id;
      try{
          if(req.file!==undefined){
            let imageFiles = req.files;
            let response = await multipleUpload(imageFiles);
            await Product.findOneAndUpdate({_id:prodId},{$set:{"images":response}});
          }
        // fetching existing images array
        let productdb = await Product.findOne({_id:prodId});
        console.log(productdb);
        let dbimages = await productdb.images;
        let product = {
          product_name : req.body.product_name,
          description : req.body.product_description,
          stock : req.body.stock,
          status : req.body.status,
          measurements : {
            width : req.body.width,
            height : req.body.height,
            depth : req.body.depth,
            max_load : req.body.max_load,
          },
          images : dbimages,
        }
        let dbProduct = await Product.findOneAndUpdate({_id:prodId},product);
        res.redirect('/admin/product-management');
      }catch(err){
        console.log(err);
      }
  },
  // deleting product
  deleteProduct:async(req,res)=>{
    let productId = req.params.id;
    try{
      let response = await Product.findByIdAndDelete(productId);
      if(response) res.redirect('/admin/product-management');
    }catch(err){
      console.log(err);
    }
  }
};
