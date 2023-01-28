const Product = require("../../models/products-schema");

module.exports = {
    fetchProduct:async(req,res)=>{
        let productId = req.params.id;
        try{
            let dbproduct = await Product.find({_id:productId}).populate(['parent_category','sub_category']);
            
            let product = dbproduct.find((object)=>{
                return object;
            })
            let parent = product.parent_category.find((object)=>{
                return object;
            })
            console.log(product)
            // res.send(product)
            res.render('product-detail',{product:product,parent:parent});
        }catch(err){
            console.log(err);
        }
    }
}