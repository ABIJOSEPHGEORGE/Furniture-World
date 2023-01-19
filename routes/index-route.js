const express = require('express');
const { isLoggedIn, sessionHandler } = require('../middlewares/sessions');
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('home');
})

module.exports = router;