const { fetchAllCategory } = require("./category-management");
const { singleCoupon } = require("./coupon-management");
const { fetchAllUsers, searchUserCntrlr } = require("./user-management");

module.exports = {
    signinPage:(req,res)=>{
        req.session.admin = req.body.email;
        res.render('admin-signin');
    },
    dashboardPage:(req,res)=>{
        res.render('admin-dashboard');
    },
    usersManagement:(req,res)=>{
        fetchAllUsers().then((users)=>{
            res.render('user-management',{users:users});
        })
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
    }
}