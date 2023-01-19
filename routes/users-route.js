const express = require('express');
const { updatePassword, createUser } = require('../controllers/controllers');
const { signupPage, otpPage, signinPage, forgetPassPage, resetPassPage} = require('../controllers/render-controller');
const { AuthSession, signupSession, sessionHandler, sessionDestroy } = require('../middlewares/sessions');
const { isUserExist, authPassword, userStatus } = require('../middlewares/signin-middlewares');
const { validateUser,checkPassword, generateOtp, verifyOtp, userObj, regenerateOtp } = require('../middlewares/signup-middlewares');
const router = express.Router();




router.get('/signup',AuthSession,signupPage);
router.get('/signin',AuthSession,signinPage);
router.get('/verify-otp',otpPage);
router.get('/forget-password',AuthSession,forgetPassPage);
router.get('/logout',sessionDestroy);
router.get('/resend-otp',regenerateOtp,otpPage)

router.post('/signup',validateUser,checkPassword('user-signup'),generateOtp,userObj,otpPage);
router.post('/verify-user',verifyOtp('verify-otp'),createUser);
router.post('/signin',isUserExist('user-signin'),userStatus,authPassword);
router.post('/forget-password',isUserExist('forget-password'),generateOtp,resetPassPage);
router.post('/reset-password',verifyOtp('reset-password'),checkPassword('reset-password'),updatePassword);

module.exports = router;