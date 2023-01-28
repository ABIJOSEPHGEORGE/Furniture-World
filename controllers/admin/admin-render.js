const Banner = require("../../models/banner");
const SubCategory = require("../../models/sub-category");
const { fetchAllCategory } = require("./category-management");
const { singleCoupon } = require("./coupon-management");
const { fetchAllProduct } = require("./product-management");
const {populateCategory, populateParentCategory, fetchAllSubCategory } = require("./sub-category-management");
const { fetchAllUsers, searchUserCntrlr } = require("./user-management");

module.exports = {
    signinPage:(req,res)=>{
        req.session.admin = req.body.email;
        res.render('admin-signin');
    },
    dashboardPage:(req,res)=>{
        res.render('admin-dashboard');
    },
    searchUser:(req,res)=>{
        searchUserCntrlr(req.body.search_key)
        .then((users)=>{
            if(users){
                res.render('user-management',{users:users});
            }else{
                res.render('user-management',{users:false});
            }
        })
    },
    addCouponForm:(req,res)=>{
        res.render('add-coupon');
    },
    editCouponPage:(req,res)=>{
        singleCoupon(req.query.id)
        .then((response)=>{
            res.render('edit-coupon',{coupon:response});
        })
    },
    addProductPage:(req,res)=>{
        res.render('add-product')
    },
    addCategoryPage:(req,res)=>{
        res.render('add-category');
    },
    categoryPage:(req,res)=>{
        fetchAllCategory()
        .then((response)=>{
            if(response){ 
            res.render('category-management',{categories:response});
            }else{
             res.render('category-management',{err:'No categories found'})
            }
        })
    },
    addSubCategory:(req,res)=>{
        fetchAllCategory()
        .then((response)=>{
            res.render('add-subCategory',{category:response});
        })
    },
    subCategoryPage:(req,res)=>{
       populateParentCategory()
       .then((response)=>{
        res.render('sub-category-management',{subcat:response});
       })
       .catch((err)=>{
        console.log(err);
       })
    },
    
    addBannerPage:(req,res)=>{
        res.render('add-banner');
    },
    editBannerPage:async(req,res)=>{
        let bannerId = req.query.id;
        await Banner.findOne({_id:bannerId})
        .then((response)=>{
            res.render('edit-banner',{banner:response});
        })
    },
    addProductPage:(req,res)=>{
        fetchAllCategory()
       .then((categories)=>{
            fetchAllSubCategory()
            .then((subcategory)=>{
                res.render('add-product',{parent:categories,sub:subcategory});
            })
       })
    },
    productManagementPage:(req,res)=>{
        fetchAllProduct(req,res)
        .then((response)=>{
            res.render('product-management',{products:response});
        })
    }
}