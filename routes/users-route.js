const express = require('express');
const { updatePassword, createUser, homeUser,  } = require('../controllers/controllers');
const {sortProducts} = require('../controllers/users/product-list')
const { signupPage, otpPage, signinPage, forgetPassPage, resetPassPage, homePage, verifySignin} = require('../controllers/render-controller');
const { userAuth, sessionDestroyUser, userSession } = require('../middlewares/sessions');
const { isUserExist, authPassword, userStatus, isBlocked } = require('../middlewares/signin-middlewares');
const { validateUser,checkPassword, generateOtp, verifyOtp, userObj, regenerateOtp } = require('../middlewares/signup-middlewares');
const { fetchProduct, matchProduct } = require('../controllers/users/product-detail');
const {addToCart,getCartQty, viewCart, cartQuantity, removeItem, cartPage} = require('../controllers/users/cart');
const { requestMethod } = require('../middlewares/admin/admin-middlewares');
const { addToWishlist, viewWishlist, removeFrmWishlist, wishlistToCart, wishlistPage } = require('../controllers/users/wishlist');
const {checkoutItems, checkOutPage, applyCoupon, clearCoupon, createOrder, confirmOrder, stockChecking, applyWalletBalance} = require('../controllers/users/checkout');
const { addNewAddrss, fetchAllAddrss, singleAddress, updateAddress, profilePage, fetchUserDetails, deleteAddress, updateProfile, getOrders, singleOrder, resetPassword, cancelOrder, returnOrder, walletBalance } = require('../controllers/users/user-details');
const { fetchAllCategory } = require('../controllers/admin/category-management');
const router = express.Router();

router.use(requestMethod);


router.get('/signup',userAuth,signupPage);
router.get('/signin',userAuth,signinPage);
router.get('/verify-otp',otpPage);
router.get('/forget-password',userAuth,forgetPassPage);
router.get('/logout',sessionDestroyUser);
router.get('/resend-otp',regenerateOtp,otpPage);
router.get('/resend-signin-otp',regenerateOtp,verifySignin);
router.get('/view-product/:id',isBlocked,fetchProduct);
router.get('/add-to-cart/:id',userSession,isBlocked,addToCart);
router.get('/cart',userSession,isBlocked,cartPage)
router.get('/cart-count',getCartQty);
router.get('/add-to-wishlist/:id',userSession,isBlocked,addToWishlist);
router.get('/wishlist',userSession,isBlocked,wishlistPage);
router.get('/checkout',userSession,isBlocked,checkOutPage);
router.get('/store',(req,res)=>res.render('shop-page'));
router.get('/store/:id',sortProducts);
router.get('/all-categories',fetchAllCategory)
router.get('/user-profile',userSession,isBlocked,profilePage);
router.get('/get-user-details',userSession,isBlocked,fetchUserDetails)
router.get('/order-details/:id',userSession,isBlocked,singleOrder);
router.get('/wallet-balance',userSession,isBlocked,walletBalance);
router.get('/cod-order-confirm/:id',userSession,isBlocked,confirmOrder);
router.get('/all-address',userSession,isBlocked,fetchAllAddrss);
router.get('/edit-address/:id',userSession,isBlocked,singleAddress);
router.get('/page-not-found',((req,res)=>res.render('notfound')));
router.get('/verify-signin',((req,res)=>res.redirect('/')));


router.post('/add-new-address',userSession,isBlocked,addNewAddrss);
router.post('/checkout/create-order/:amount',userSession,isBlocked,createOrder);
router.post('/order-confirmation/:id',confirmOrder);
router.post('/stock-status',userSession,isBlocked,stockChecking);
router.post('/signup',validateUser,checkPassword('user-signup'),generateOtp,userObj,otpPage);
router.post('/verify-user',verifyOtp('verify-otp'),createUser);
router.post('/signin',isUserExist('user-signin'),userStatus,authPassword,generateOtp,verifySignin);
router.post('/verify-signin',verifyOtp('verify-signin'),homeUser)
router.post('/forget-password',isUserExist('forget-password'),generateOtp,resetPassPage);
router.post('/reset-password',verifyOtp('reset-password'),checkPassword('reset-password'),updatePassword);
router.post('/checkout',userSession,isBlocked,checkoutItems);
router.post('/update-profile',userSession,isBlocked,updateProfile)
router.post('/all-orders',userSession,isBlocked,getOrders);
router.post('/search-products/:search_key',matchProduct);
router.post('/wishlist',userSession,isBlocked,viewWishlist);
router.post('/apply-wallet-balance',userSession,isBlocked,applyWalletBalance);
router.post('/cart',userSession,isBlocked,viewCart)
router.post('/apply-coupon/:coupon',userSession,isBlocked,applyCoupon);
router.post('/clear-coupon/:coupon',userSession,isBlocked,clearCoupon);

router.put('/update-qty/:id/:st',userSession,isBlocked,cartQuantity);
router.put('/wishlist/add-to-cart/:id',userSession,isBlocked,wishlistToCart)
router.put('/remove-wishlist-item/:id',userSession,isBlocked,removeFrmWishlist);
router.put('/profile-reset-password',userSession,isBlocked,resetPassword);
router.put("/cancel-order/:id",userSession,isBlocked,cancelOrder);
router.put("/return-order/:id",userSession,isBlocked,returnOrder);
router.put('/update-address/:id',userSession,isBlocked,updateAddress);

router.delete('/remove-item/:id',userSession,isBlocked,removeItem);
router.delete('/wishlist/remove-item/:id',userSession,isBlocked,removeFrmWishlist);
router.delete('/delete-address/:id',userSession,isBlocked,deleteAddress);


module.exports = router;