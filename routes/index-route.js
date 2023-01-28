const express = require('express');
const { fetchAllParentCategories } = require('../controllers/controllers');
const { homePage } = require('../controllers/render-controller');
const { isLoggedIn, sessionHandler } = require('../middlewares/sessions');
const { getCartCount, isBlocked } = require('../middlewares/signin-middlewares');
const Category = require('../models/category-schema');
const router = express.Router();




router.get('/',getCartCount,isBlocked,homePage);

module.exports = router;