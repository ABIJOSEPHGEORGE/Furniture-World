const { compare } = require("bcrypt");
const { default: mongoose } = require("mongoose");
const Category = require("../../models/category-schema");
const Product = require("../../models/products-schema");
const SubCategory = require("../../models/sub-category");
const User = require("../../models/users-schema");

module.exports = {
  sortProducts: async (req, res) => {
    let categoryId = req.params.id;
    let subcategory = req.query.sub || "All";
    const page = req.query.p || 1;
    const productPerPage = 3;

    //fetching all subcategories under category
    let allSubCategories = await sortSubCategories(categoryId);

    let [products, totalProducts] = await fetchProducts(subcategory,categoryId,page,productPerPage);
    
    //checking if the products exist in wishlist
    let wishlistProducts = await existInWishlist(products,req.session.user);
    console.log(wishlistProducts)

    res.render("shop-page", {
      products: wishlistProducts,
      allSubCategories: allSubCategories,
      totalProducts: totalProducts.totalCount,
      currentPage:page,
      hasNextPage : productPerPage*page<totalProducts.totalCount,
      nextPage : page+1,
      lastPage : Math.ceil(totalProducts/productPerPage)
    });
  },
};

// sortSubCategories = (categoryId) => {
//   try {
//     let responses = Category.findById(categoryId).populate({
//       path: "sub_category",
//       select: ["_id", "sub_category_name"],
//     });
//     if (responses) return responses;
//   } catch (err) {
//     console.log(err);
//   }
// };

// fetchProducts = async (subcatId, categoryId, page,productPerPage,req) => {
  
//   const skip = (page-1)*productPerPage;
//   let subcategories = await sortSubCategories(categoryId);
//   let subcategoryIds = await subcategories.sub_category.map((values) => {
//     return values._id;
//   });
//   subcatId != "All" ? subcatId.toString() : subcatId;
//   let categoryFilter;
//   let statusFilter = { status:true };
//   subcatId == "All"
//     ? (categoryFilter = { sub_category: { $in: subcategoryIds } })
//     : (categoryFilter = {
//         sub_category: { $in: [mongoose.Types.ObjectId(subcatId)] },
//       });
//   let products = await Product.aggregate([
//     { $match: { $and: [categoryFilter,statusFilter] } },
//     { $skip: skip },
//     { $limit: productPerPage },
//   ]);
//   let totalCount = await Product.aggregate([
//     { $match: { $and: [categoryFilter, statusFilter] } },
//     { $count: "totalCount" },
//   ]);
//   const totalProducts = totalCount.find((obj) => {
//     return obj;
//   });
 
  
//   return [products, totalProducts];
// };


async function sortSubCategories(categoryId) {
  try {
    const category = await Category.findById(categoryId).populate({
      path: "sub_category",
      select: ["_id", "sub_category_name"],
    });
    return category;
  } catch (err) {
    console.error(err);
  }
}


fetchProducts = async (subcatId, categoryId, page, productPerPage, req) => {
  const skip = (page - 1) * productPerPage;
  let subcategories = await sortSubCategories(categoryId);
  let subcategoryIds = subcategories.sub_category.map((values) => values._id);
  const subcatIdObjectId = subcatId !== "All" ? mongoose.Types.ObjectId(subcatId) : subcatId;
  let categoryFilter;
  let statusFilter = { status: true };
  subcatId === "All"
    ? (categoryFilter = { sub_category: { $in: subcategoryIds } })
    : (categoryFilter = { sub_category: { $in: [subcatIdObjectId] } });
  let products = await Product.aggregate([
    { $match: { $and: [categoryFilter, statusFilter] } },
    { $skip: skip },
    { $limit: productPerPage },
  ]);
  let totalCount = await Product.aggregate([
    { $match: { $and: [categoryFilter, statusFilter] } },
    { $count: "totalCount" },
  ]);
  const totalProducts = totalCount.find((obj) => obj);
  return [products, totalProducts];
};

async function existInWishlist (products,email){
  if(typeof email === "undefined"){
    return products;
  }else{
        try{
          let user = await User.findOne({email:email});
          let wishlist = user.wishlist;
          products = products.map(product => {
            if(wishlist.includes(product._id)){
              product.wishlist = true;
            }else{
              product.wishlist = false
            }
            return product
          })
          return products;
      }catch(err){
          console.error(err);
      }
  }
  
}



