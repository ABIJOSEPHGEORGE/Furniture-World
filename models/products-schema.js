const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Product = mongoose.model('Product',new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
        unique:true,
    },
    category:{
        type:String,
        required:true,
    },
    sub_category:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    stock:{
        type:Number,
        required:true,
    },
    measurements:{
        type:Object,
    },
    tags:{
        type:Array,
        required:true,
    },
    last_updated_user:{
        type:ObjectId,
    },
    last_updated:{
        type:Date,
        required:true,
    },
    status:{
        type:Boolean,
    },
    images:{
        type:Array,
        required:true,
    },
    price:{
        type:Number,
        required:true,
    },
    sale_price:{
        type:Number,
        required:true,
    }
}))

module.exports = Product;