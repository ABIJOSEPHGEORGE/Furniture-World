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
        type:Array,
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
    cart:[{
            productId:mongoose.Types.ObjectId,
            quantity:Number,
        }],
    wishlist:{
        type:Array,
    },
    address:[
        {
            id : mongoose.Types.ObjectId,
            f_name : {
                type : String,
                required : true,
            },
            l_name : {
                type : String,
                required : true,
            },
            company : {
                type : String,
            },
            number : {
                type : Number,
                required : true,
            },
            email : {
                type : String,
                required : true,
            },
            addOne : {
                type : String,
                required : true,
            },
            addTwo : {
                type : String,
            },
            city : {
                type : String,
                required : true,
            },
            state :{
                type : String,
                required : true,
            },
            country : {
                type : String,
                required : true,
            },
            zip : {
                type : String,
                required : true,
            }
        }
    ],
    wallet_balance:{
        type:Number,
        default:0,
        min:0,
    }
},
{timestamps:true}
))
   
module.exports = User;