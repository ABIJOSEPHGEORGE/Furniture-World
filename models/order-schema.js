const mongoose = require('mongoose');

const Order = mongoose.model('Order',new mongoose.Schema({
    orderId:{
        type:String,
    },
    delivery_address:{
        type:String,
    },
    bill_amount:{
        type:Number
    },
    status:{
        type:Boolean
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
    order_date:{
        type:Date,
    },
    delivery_data:{
        type:Data,
    }
}))

module.exports = Order;