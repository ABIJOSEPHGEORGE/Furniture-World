const mongoose = require('mongoose');

const Admin = mongoose.model('admin',new mongoose.Schema({
    username:{
        type:String,
        unique:true,
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
    admin:{
        type:Boolean,
        default:true,
    },
    last_login:{
        type:Date,
    }
}),
'admin')



module.exports = Admin;