const Cart = require("../../models/cart");
const Product = require("../../models/products-schema");
const { findOne } = require("../../models/users-schema");
const User = require("../../models/users-schema");

module.exports = {
    addToCart:async(req,res)=>{
        let userEmail = req.session.user;
        let prodId = req.params.id;
        let dbUser = await User.findOne({email:userEmail});
        //check wheather item already existing
        let prodExist = await dbUser.cart.reduce((acc,curr)=>{
           return curr.productId.toString()===prodId ? acc = 1 : acc = 0;
        },0)
        console.log(prodExist)
        if(prodExist===0){
            let item = {
                productId : prodId,
                quantity : 1,
            }
            try{
                let response = await User.findOneAndUpdate({email:userEmail},{$push:{'cart':item}})
                if(response) res.redirect('/users/cart');
            }catch(err){
                console.log(err);
            }
            
        }else{
            try{
                await User.findOneAndUpdate({email:userEmail,"cart.productId":prodId},
                {$inc:{"cart.$.quantity":1}},{new:true});
                res.redirect('/users/cart')
            }catch(err){
                console.log(err);
            }
        }
    },
    getCartQty:async(req,res)=>{
        let userEmail = req.session.user;
        try{
            let dbUser = await User.findOne({email:userEmail});
            let count = dbUser.cart.reduce((acc,curr)=>{
                acc = acc+curr.quantity;
                return acc;
            },0)
            return res.json(count);
        }catch(err){
            res.json(err);
        }
        
    },
    viewCart:async(req,res)=>{
        let userEmail = req.session.user;
        try{
            let dbUser = await User.findOne({email:userEmail});
            let products = await Promise.all(dbUser.cart.map(async(ele)=>{
                let dbprodct = await Product.findOne({_id:ele.productId});
                let items = {
                    item:dbprodct,
                    qty : ele.quantity,
                    totalPrice : ele.quantity * dbprodct.sale_price,
                }
                return items;
            }))
            //calculating sub total
            let subTotal = await products.reduce((acc,curr)=>{
                acc = acc + curr.totalPrice;
                return acc;
            },0)
            console.log(subTotal);
            res.render('cart',{products:products,subTotal:subTotal});
        }catch(err){
            res.json(err);
           console.log(err);
        }
    },
    cartQuantity:async(req,res)=>{
        let prodId = req.params.id;
        let status = req.params.st;
        let userEmail = req.session.user;
        try{
            if(status==="inc"){
                await User.findOneAndUpdate({email:userEmail,"cart.productId":prodId},
                {$inc:{"cart.$.quantity":1}},{new:true});
                res.redirect('/users/cart/#products')
            }else{
                let response = await User.findOneAndUpdate({email:userEmail,"cart.productId":prodId},
                {$inc:{"cart.$.quantity":-1}},{new:true});
                
                await response.cart.forEach(async(ele)=>{
                    if(ele.quantity<=0){
                        await User.updateOne({email:userEmail},{$pull:{"cart":{"productId":prodId}}});
                    }
                })
                res.redirect('/users/cart/#products');
            } 
        }catch(err){
            if(err) res.json(err);
        }
    },
    removeItem:async(req,res)=>{
        let prodId = req.params.id;
        let userEmail = req.session.user;
        try{
            let response = await User.updateOne({email:userEmail},{$pull:{"cart":{"productId":prodId}}});
            if(response){
                res.redirect('/users/cart/#products');
            }
        }catch(err){
            console.log(err);
        }
    },
    
}


// findProduct=async(productId)=>{
//        try{
//         let product = await Product.findById(productId);
//         return product;
//        }catch(err){
//         console.log(err);
//        }
// }

