var express = require('express');
const {signinPage,searchUser, addCouponForm, editCouponPage, addCategoryPage, addBannerPage, editBannerPage, productManagementPage} = require('../controllers/admin/admin-render');
const { isAdminExist, checkPassword } = require('../middlewares/admin/auth-middlewares');
const { requestMethod, userStatus, deleteUser, checkCoupon, couponName} = require('../middlewares/admin/admin-middlewares');
const { addCoupon, allCoupons,  updateCoupon, deleteCoupon, listUnlistCoupon } = require('../controllers/admin/coupon-management');
const {  uploadAndCreate, editCategory, updateCategory, categoryPage, addSubCategory } = require('../controllers/admin/category-management');
const upload = require('../services/multer');
const { createSubCategory, deleteSubCategory, editSubCategory, renderSubCategory , editSubCategoryPage, fetchSubcategories } = require('../controllers/admin/sub-category-management');
const { createBanner, fetchAllBanners, bannerStatus, deleteBanner, editBanner } = require('../controllers/admin/banner-management');
const { createProduct, viewProduct, updateStatus, editProductPage, deleteProduct, allCategories,allSubcategories, updateProduct, addProductPage, fetchCategories, updateProductSub } = require('../controllers/admin/product-management');
const { usersManagement } = require('../controllers/admin/user-management');
const { authSession, sessionAdmin, sessionDestroyAdmin } = require('../middlewares/admin/admin-session');
const { orderMngmt, invoice, updateOrderStatus, orderPage, fetchOrderStatus } = require('../controllers/admin/order-management');
const { salesReport, salesReportPage, dashboardPage, graphData, monthlyGraph } = require('../controllers/admin/dashboard');




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
router.get('/sub-category-management',sessionAdmin,renderSubCategory);
router.get('/edit-subcategory',sessionAdmin,editSubCategoryPage);
router.get('/add-banner',sessionAdmin,addBannerPage);
router.get('/banner-management',sessionAdmin,fetchAllBanners);
router.get('/edit-banner',sessionAdmin,editBannerPage);
router.get('/all-categories',sessionAdmin,allCategories);
router.get('/all-subcategories',sessionAdmin,allSubcategories);
router.get('/product-management',sessionAdmin,productManagementPage);
router.get('/view-product',sessionAdmin,viewProduct);
router.get('/edit-product',sessionAdmin,editProductPage);
router.get('/order-management',sessionAdmin,orderPage);
router.get('/add-product',sessionAdmin,addProductPage);
router.get('/invoice',sessionAdmin,invoice);
router.get('/sales-report',sessionAdmin,salesReportPage);


router.post('/sales-report',sessionAdmin,salesReport);
router.post('/signin',isAdminExist,checkPassword);
router.post('/user-management',searchUser)
router.post('/add-coupon',sessionAdmin,checkCoupon,addCoupon)
router.post('/edit-coupon',sessionAdmin,updateCoupon)
router.post('/add-category',upload.single("category_image"),uploadAndCreate);
router.post('/add-sub-category',upload.single("category_image"),createSubCategory);
router.post('/add-banner',upload.single("banner_image"),createBanner);
router.post('/add-product',upload.array('product-image',3),createProduct);
router.post('/order-management',sessionAdmin,orderMngmt);
router.post('/order-status/:id',sessionAdmin,fetchOrderStatus);
router.post('/graph-data',sessionAdmin,graphData);
router.post('/monthly-data',sessionAdmin,monthlyGraph);
router.post('/fetch-categories/:id',sessionAdmin,fetchCategories);
router.post('/fetch-subcategories/:id',sessionAdmin,fetchSubcategories);


router.put('/user-management/block/:id',sessionAdmin,userStatus);
router.put('/user-management/unblock/:id',sessionAdmin,userStatus);
router.put('/coupon-unlist/:id',sessionAdmin,listUnlistCoupon(false));
router.put('/coupon-list/:id',sessionAdmin,listUnlistCoupon(true));
router.put('/update-category',sessionAdmin,upload.single("category_image"),updateCategory);
router.put('/update-subcategory',sessionAdmin,upload.single("category-image"),editSubCategory);
router.put('/banner-status/:id/',sessionAdmin,bannerStatus);
router.put('/update-banner/:id',sessionAdmin,upload.single("banner_image"),editBanner)
router.put('/product-status/:id',sessionAdmin,updateStatus);
router.put('/update-product/:id',sessionAdmin,upload.array("product-image",3),updateProduct);
router.put('/update-order-status/:id',sessionAdmin,updateOrderStatus);
router.put('/update-product-subcategory/:id',sessionAdmin,updateProductSub)


router.delete('/user-management/delete/:id',sessionAdmin,deleteUser);
router.delete('/delete-coupon/:id',sessionAdmin,deleteCoupon);
router.delete('/delete-subcategory/:id/:public_id/:parent_id',sessionAdmin,deleteSubCategory);
router.delete('/delete-banner/:id',sessionAdmin,deleteBanner);
router.delete('/delete-product/:id',sessionAdmin,deleteProduct)

module.exports = router;