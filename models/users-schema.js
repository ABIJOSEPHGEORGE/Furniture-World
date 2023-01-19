const mongoose = require('mongoose');

const User = mongoose.model('Users',new mongoose.Schema({
    first_name:{
        type:String,
        required:true,
    },
    last_name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:true,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        minlength:10,
        maxlength:10,
    },
    phone_verified:{
        type:Boolean,
        default:false,
    },
    email_verified:{
        type:Boolean,
        default:false,
    },
    address:{
        type:Object,
    },
    admin:{
        type:Boolean,
        default:false,
    },
    status:{
        type:Boolean,
        default:false,
    },
    last_login:{
        type:Date,
        
    },
    joined_at:{
        type:Date,
        required:true,
    },
    cart:{
        type:Object,
    },
    wishlist:{
        type:Object,
    },
},
{timestamps:true}
))
   
module.exports = User;