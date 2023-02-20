const mongoose = require('mongoose');

const Coupon = mongoose.model('Coupon',new mongoose.Schema({
    coupon_id:{
        type:String,
        required:true,
        unique:true,
    },
    status:{
        type:Boolean,
        default:true,
    },
    user_allowed:{
        type:Number,
        required:true,
    },
    minimum_purchase:{
        type:Number,
        required:true,
    },
    claimed_users:{
        type:Number,
    },
    last_updated:{
        type:Date,
    },
    last_updated_user:{
        type:String,
    },
    expiry_date:{
        type:Date,
        required:true,
    },
    discount:{
        type:Number,
        required:true,
    },
    
}))

module.exports = Coupon;