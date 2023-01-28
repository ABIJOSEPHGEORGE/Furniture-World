const express = require('express');
const { updatePassword, createUser,  } = require('../controllers/controllers');
const {sortProducts} = require('../controllers/users/product-list')
const { signupPage, otpPage, signinPage, forgetPassPage, resetPassPage} = require('../controllers/render-controller');
const { userAuth, sessionDestroyUser, userSession } = require('../middlewares/sessions');
const { isUserExist, authPassword, userStatus, isBlocked } = require('../middlewares/signin-middlewares');
const { validateUser,checkPassword, generateOtp, verifyOtp, userObj, regenerateOtp } = require('../middlewares/signup-middlewares');
const { fetchProduct } = require('../controllers/users/product-detail');
const {addToCart,getCartQty, viewCart, cartQuantity, removeItem} = require('../controllers/users/cart');
const { requestMethod } = require('../middlewares/admin/admin-middlewares');
const { addToWishlist, viewWishlist, removeFrmWishlist } = require('../controllers/users/wishlist');
const router = express.Router();

router.use(requestMethod);


router.get('/signup',userAuth,signupPage);
router.get('/signin',userAuth,signinPage);
router.get('/verify-otp',otpPage);
router.get('/forget-password',userAuth,forgetPassPage);
router.get('/logout',sessionDestroyUser);
router.get('/resend-otp',regenerateOtp,otpPage);
router.get('/store/:id',isBlocked,sortProducts);
router.get('/view-product/:id',isBlocked,fetchProduct);
router.get('/add-to-cart/:id',userSession,isBlocked,addToCart);
router.get('/cart',userSession,isBlocked,viewCart)
router.get('/cart-count',getCartQty);
router.get('/add-to-wishlist/:id',addToWishlist);
router.get('/wishlist',viewWishlist);


router.post('/signup',validateUser,checkPassword('user-signup'),generateOtp,userObj,otpPage);
router.post('/verify-user',verifyOtp('verify-otp'),createUser);
router.post('/signin',isUserExist('user-signin'),userStatus,authPassword);
router.post('/forget-password',isUserExist('forget-password'),generateOtp,resetPassPage);
router.post('/reset-password',verifyOtp('reset-password'),checkPassword('reset-password'),updatePassword);


router.put('/update-qty/:id/:st',cartQuantity);
router.put('/remove-wishlist-item/:id',removeFrmWishlist);

router.delete('/remove-item/:id',removeItem);


module.exports = router;