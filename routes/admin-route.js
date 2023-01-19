var express = require('express');
const {signinPage, dashboardPage,usersManagement,searchUser, addProductPage, addCouponForm, editCouponPage, addCategoryPage, categoryPage, editCategoryPage} = require('../controllers/admin/admin-render');
const { isAdminExist, checkPassword } = require('../middlewares/admin/auth-middlewares');
const { requestMethod, userStatus, deleteUser, checkCoupon, couponName, categoryExist} = require('../middlewares/admin/admin-middlewares');
const { addCoupon, allCoupons,  updateCoupon, deleteCoupon, listUnlistCoupon } = require('../controllers/admin/coupon-management');
const { authSession, sessionDestroyAdmin } = require('../controllers/admin/session-admin');
const {sessionAdmin} = require('../controllers/admin/session-admin');
const { createCategory, uploadAndCreate, isCategoryExist, deleteCategory, editCategory, updateCategory } = require('../controllers/admin/category-management');
const upload = require('../services/multer');



var router = express.Router();

router.use(requestMethod);

router.get('/',authSession,signinPage);
router.get('/admin-dashboard',sessionAdmin,dashboardPage);
router.get('/user-management',sessionAdmin,usersManagement);
router.get('/coupon-management',sessionAdmin,allCoupons)
router.get('/add-coupon',sessionAdmin,addCouponForm)
router.get('/edit-coupon',sessionAdmin,editCouponPage)
router.get('/add-product',addProductPage)
router.get('/logout',sessionDestroyAdmin);
router.get('/add-category',addCategoryPage);
router.get('/uploads',express.static('uploads'));
router.get('/category-management',categoryPage);
router.get('/edit-category',editCategory)

router.post('/signin',isAdminExist,checkPassword);
router.post('/user-management',searchUser)
router.post('/add-coupon',checkCoupon,addCoupon)
router.post('/edit-coupon',couponName,updateCoupon)
router.post('/add-category',categoryExist,upload.single("category_image"),categoryExist,uploadAndCreate);

router.put('/user-management/block/:id',userStatus);
router.put('/user-management/unblock/:id',userStatus);
router.put('/coupon-unlist/:id',listUnlistCoupon(false));
router.put('/coupon-list/:id',listUnlistCoupon(true));
router.put('/update-category/:id',upload.single("category_image"),updateCategory)


router.delete('/user-management/delete/:id',deleteUser);
router.delete('/delete-coupon/:id',deleteCoupon);
router.delete('/delete-category/:id/:public_id',deleteCategory)


module.exports = router;