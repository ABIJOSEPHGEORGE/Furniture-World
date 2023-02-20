const express = require('express');
const { homePage } = require('../controllers/render-controller');
const { getCartCount, isBlocked } = require('../middlewares/signin-middlewares');
const router = express.Router();

router.get('/',getCartCount,isBlocked,homePage);

module.exports = router;