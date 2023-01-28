const mongoose = require('mongoose');

const Banner = mongoose.model('Banner',new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    banner_image:{
        type:String,
        required:true,
    },
    cloudinary_id:{
        type:String,
    },
    status:{
        type:Boolean,
        default:true,
    }
}))

module.exports = Banner;