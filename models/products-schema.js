const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Product = mongoose.model('Product',new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
        unique:true,
    },
    parent_category:[{
        type:mongoose.Types.ObjectId,
        ref: 'Category',
    }],
    sub_category:{
        type:String,
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
    last_updated_user:{
        type:ObjectId,
    },
    last_updated:{
        type:Date,
    },
    status:{
        type:Boolean,
        default:true,
    },
    images:{
        type:Array,
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