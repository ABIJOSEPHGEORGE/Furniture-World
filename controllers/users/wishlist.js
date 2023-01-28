const Product = require("../../models/products-schema");
const User = require("../../models/users-schema");

module.exports = {
    addToWishlist:async(req,res)=>{
        let prodId = req.params.id;
        let userEmail = req.session.user;
            try{
                let response = await User.findOneAndUpdate({email:userEmail},{$push:{'wishlist':prodId}})
                backURL=req.header('Referer') || '/';
                res.redirect(`${backURL}#${prodId}`);
            }catch(err){
                console.log(err);
            }
    },
    viewWishlist:async(req,res)=>{
        try{
            let user = await User.findOne({email:req.session.user});
            let products = await Promise.all(user.wishlist.map(async(ele)=>{
            return await Product.findOne({_id:ele});
            }))
            res.json(products);
        }catch(err){
            console.log(err);
        }
    },
    removeFrmWishlist:async(req,res)=>{
        try{
            let prodId = req.params.id;
            await User.updateOne({email:req.session.user},{$pull:{"wishlist":prodId}});
            backURL=req.header('Referer') || '/';
            res.redirect(`${backURL}#${prodId}`);
        }catch(err){
            console.log(err);
        }
    }
    
}