
const mongoose = require('mongoose');

const SubCategory = mongoose.model('SubCategory',new mongoose.Schema({
    sub_category_name:{
        type:String,
        required:true,
    },
    sub_category_image:{
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
        required:true,
    },
    parent_category:[{
        type:mongoose.Types.ObjectId,
        ref: 'Category',
    }],
}))

module.exports = SubCategory;