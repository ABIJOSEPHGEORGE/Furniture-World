const mongoose = require('mongoose');

const Category = mongoose.model('Category',new mongoose.Schema({
    category_name:{
        type:String,
        required:true,
        unique:true,
    },
    category_image:{
        type:String,
        required:true,
    },
    cloudinary_id:{
        type:String,
    },
    status:{
        type:Boolean,
        default:true,
    },
    description:{
        type:String,
    },
    last_updated:{
        type:Date,
    },
    sub_category:{
        type:Array,
    }
}))

module.exports = Category;