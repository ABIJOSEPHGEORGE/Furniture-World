const Category = require("../../models/category-schema");
const upload = require('../../services/multer')
const {cloudinary} = require("../../services/cloudinary");
const { uploadImage, overwriteImage } = require("../../services/cloudinary");

module.exports = {
    fetchAllCategory:async()=>{
        try{
            let dbcategories = await Category.find({});
            return dbcategories; 
        }catch(err){
            console.log(err);
        }
    }
    ,
   
    isCategoryExist:async(category_name)=>{
        try{
            let category = await Category.findOne({category_name:category_name});
            return category;
        }catch(err){
            console.log(err);
        }
    },
    //upload image to cloudinary
    uploadAndCreate:(req,res)=>{
       
        //uploading image to cloudinary
            uploadImage(req.file.path)
            .then(async (response)=>{
            let category = new Category({
                        category_name:req.body.category_name,
                        description:req.body.category_description,
                        category_image : response.secure_url,
                        cloudinary_id:response.public_id,
                });
                //saving category to db
                await category.save();
                res.redirect('/admin/category-management');
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    //delete category
    deleteCategory:async(req,res)=>{
        await Category.findByIdAndDelete(req.params.id)
        .then(async(response)=>{
            if(response) await cloudinary.uploader.destroy(req.params.public_id);
            res.redirect('/admin/category-management');
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    //edit category page
    editCategory:async(req,res)=>{
        await Category.findOne({ObjectId:req.query.id})
        .then((response)=>{
            res.render('edit-category',{category:response});
        })
        .catch((err)=>{
            console.log(err);
        })
    },
    getCategoryImage:async(id)=>{
        await Category.findById(id)
        .then((response)=>{
            return response.category_image;
        })
    },
    //update category
    updateCategory:async(req,res)=>{
        let dbCategory = await Category.findOne({_id:req.params.id});
        if(req.file!==undefined){
            overwriteImage(req.file.path,dbCategory.cloudinary_id)
            .catch((err)=>console.log(err))
        }
        let category = {
            category_name:req.body.category_name,
            description:req.body.category_description,
        }
        await Category.findOneAndUpdate({_id:req.params.id},category,{new:true})
        .exec((err,result)=>{
           if(result){
            res.redirect('/admin/category-management');
           }else{ console.log(err);}

        })
    }
}