var express = require('express');
const {signinPage, dashboardPage,searchUser, addProductPage, addCouponForm, editCouponPage, addCategoryPage, categoryPage, editCategoryPage, addSubCategory, subCategoryPage, addBannerPage, editBannerPage, productManagementPage} = require('../controllers/admin/admin-render');
const { isAdminExist, checkPassword } = require('../middlewares/admin/auth-middlewares');
const { requestMethod, userStatus, deleteUser, checkCoupon, couponName, categoryExist} = require('../middlewares/admin/admin-middlewares');
const { addCoupon, allCoupons,  updateCoupon, deleteCoupon, listUnlistCoupon } = require('../controllers/admin/coupon-management');
const { createCategory, uploadAndCreate, isCategoryExist, deleteCategory, editCategory, updateCategory } = require('../controllers/admin/category-management');
const upload = require('../services/multer');
const { createSubCategory, getDetails, deleteSubCategory, editSubCategory, renderSubCategory , editSubCategoryPage } = require('../controllers/admin/sub-category-management');
const { createBanner, fetchAllBanners, bannerStatus, deleteBanner, editBanner } = require('../controllers/admin/banner-management');
const { createProduct, viewProduct, updateStatus, editProductPage, deleteProduct, allCategories, newPrdctPage, allSubcategories } = require('../controllers/admin/product-management');
const { usersManagement } = require('../controllers/admin/user-management');
const { authSession, sessionAdmin, sessionDestroyAdmin } = require('../middlewares/admin/admin-session');
const { orderMngmtPage } = require('../controllers/admin/order-management');




var router = express.Router();

router.use(requestMethod);

router.get('/',authSession,signinPage);
router.get('/admin-dashboard',sessionAdmin,dashboardPage);
router.get('/user-management',sessionAdmin,usersManagement);
router.get('/coupon-management',sessionAdmin,allCoupons)
router.get('/add-coupon',sessionAdmin,addCouponForm)
router.get('/edit-coupon',sessionAdmin,editCouponPage)

router.get('/logout',sessionDestroyAdmin);
router.get('/add-category',sessionAdmin,addCategoryPage);
router.get('/uploads',express.static('uploads'));
router.get('/category-management',sessionAdmin,categoryPage);
router.get('/edit-category',sessionAdmin,editCategory)
router.get('/add-sub-category',sessionAdmin,addSubCategory);
router.get('/sub-category-management',renderSubCategory);
router.get('/edit-subcategory',editSubCategoryPage);

router.get('/add-banner',sessionAdmin,addBannerPage);
router.get('/banner-management',sessionAdmin,fetchAllBanners);
router.get('/edit-banner',sessionAdmin,editBannerPage);

router.get('/all-categories',allCategories);
router.get('/all-subcategories',allSubcategories);

router.get('/product-management',sessionAdmin,productManagementPage);
router.get('/view-product',sessionAdmin,viewProduct);
router.get('/edit-product',sessionAdmin,editProductPage);
router.get('/order-management',sessionAdmin,orderMngmtPage);
router.get('/add-product',sessionAdmin,addProductPage);

router.post('/signin',isAdminExist,checkPassword);
router.post('/user-management',searchUser)
router.post('/add-coupon',checkCoupon,addCoupon)
router.post('/edit-coupon',couponName,updateCoupon)
router.post('/add-category',categoryExist,upload.single("category_image"),categoryExist,uploadAndCreate);
router.post('/add-sub-category',upload.single("category_image"),createSubCategory);
router.post('/add-banner',upload.single("banner_image"),createBanner);
router.post('/add-product',upload.array('product-image',3),createProduct)

router.put('/user-management/block/:id',userStatus);
router.put('/user-management/unblock/:id',userStatus);
router.put('/coupon-unlist/:id',listUnlistCoupon(false));
router.put('/coupon-list/:id',listUnlistCoupon(true));
router.put('/update-category/:id',upload.single("category_image"),updateCategory);
router.put('/update-subcategory/:id/:parent',upload.single("fileup"),editSubCategory);
router.put('/banner-status/:id/',bannerStatus);
router.put('/update-banner/:id',upload.single("banner_image"),editBanner)
router.put('/product-status/:id',updateStatus);



router.delete('/user-management/delete/:id',deleteUser);
router.delete('/delete-coupon/:id',deleteCoupon);
router.delete('/delete-category/:id/:public_id',deleteCategory);
router.delete('/delete-subcategory/:id/:public_id/:parent_id',deleteSubCategory);
router.delete('/delete-banner/:id',deleteBanner);
router.delete('/delete-product/:id',deleteProduct)






module.exports = router;