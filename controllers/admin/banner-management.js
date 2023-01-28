const Banner = require("../../models/banner")
const {cloudinary, overwriteImage} = require("../../services/cloudinary")
const { uploadImage } = require("../../services/cloudinary")

module.exports = {
    createBanner:(req,res)=>{
        //upload image to cloudinary
        uploadImage(req.file.path)
        .then(async(response)=>{
           let banner = {
                title : req.body.banner_title,
                description : req.body.banner_description,
                banner_image : response.secure_url,
                cloudinary_id : response.public_id,
            }
            await Banner.create(banner);
            res.redirect('/admin/banner-management');
        })
        .catch((err)=>{
            console.log(err);
            res.render('add-banner',{err:'Unable to create banner, Try after sometimes'});
        })
    },
    fetchAllBanners:(req,res)=>{
       Banner.find({})
       .then((response)=>{
        res.render('banner-management',{banners:response});
       }) 
    },
    bannerStatus:async(req,res)=>{
        let status = req.query.status;
        let bannerId = req.params.id;
        await Banner.findByIdAndUpdate(bannerId,{status:status})
        .exec((err,result)=>{
            if(!err){
                res.redirect('/admin/banner-management');
            }else{
                console.log(err);
            }
        })
    },
    deleteBanner:async(req,res)=>{
        let bannerId = req.params.id;
        let publicId = req.query.public_id;
        await cloudinary.uploader.destroy(publicId);
        await Banner.findByIdAndDelete(bannerId).exec((err,result)=>{
            err ? console.log(err) : res.redirect('/admin/banner-management');
        })

    },
    editBanner:async(req,res)=>{
        let bannerId = req.params.id;
        let dbBanner = await Banner.findOne({_id:bannerId});
        if(req.file!==undefined){
            overwriteImage(req.file.path,dbBanner.cloudinary_id)
            .catch(err=>console.log(err));
        }
        let banner = {
            banner_title : req.body.banner_title,
            description : req.body.banner_description,
        }
        await Banner.findOneAndUpdate({_id:bannerId},banner)
        .exec((err,result)=>{
            result ? res.redirect('/admin/banner-management') : console.log(err);
        })
    },
    
}