const mongoose = require('mongoose');
const User = require('./users-schema');

const Order = mongoose.model('Order',new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        ref:User,
    },
    billing_address:{
        type:Object,
    },
    bill_amount:{
        type:Number
    },
    status:{
        type:String,
        required:true,
    },
    payment_method:{
        type:String,
    },
    payment_id:{
        type:String,
    },
    coupon:{
        type:String,
    },
    coupon_discount:{
        type:Number,
    },
    wallet_discount:{
        type:Number,
    },
    order_date:{
        type:Date,
    },
    delivery_date:{
        type:Date,
    },
    products : {
        type:Array,
    },
},{timestamps:true}))

module.exports = Order;