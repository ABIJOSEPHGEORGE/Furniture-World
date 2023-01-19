const Coupon = require('../../models/coupon-schema')
module.exports = {
    isCouponExist:async(coupon_id)=>{
        try{
        let coupon = await Coupon.findOne({coupon_id:coupon_id});
        return coupon ? true : false;
        }catch(err){
            console.log(err);
        }
    },
    addCoupon:async(req,res)=>{
        try{
            await Coupon.create(req.body);
            res.redirect('/admin/coupon-management');
        }catch(err){
            console.log(err)
            res.render('add-coupon',{err:'Error in creating new coupon try after sometimes'});
        }
    },
    allCoupons:async(req,res)=>{
        try{
            let coupons = await Coupon.find({});
            res.render('coupon-management',{coupons:coupons,nodata:false});
        }catch(err){
            console.log(err);
            res.render('coupon-management',{nodata:true});
        }
    },
    singleCoupon:async(id)=>{
        try{
            let coupon = await Coupon.findOne({ObjectId:id});
            // res.render('edit-coupon',{coupon:coupon})/
            return coupon;
        }catch(err){
            console.log(err);
        }
    },
    updateCoupon:async(req,res)=>{
        try{
            console.log(req.body);
            let filter = req.query.id;
            await Coupon.updateOne({filter},req.body);
            res.redirect('/admin/coupon-management');
        }catch(err){
            console.log(err);
        }
    },
    listUnlistCoupon:(status)=>{
            return async(req,res)=>{
            await Coupon.findByIdAndUpdate(req.params.id,{status:status})
            .exec((err,user)=>{
                if(err) console.log(err);
                if(user) res.redirect('/admin/coupon-management');
            })
            }
    },
    deleteCoupon:async(req,res)=>{
        await Coupon.findByIdAndDelete(req.params.id)
        .exec((err,data)=>{
            if(err) console.log(err);
            if(data) res.redirect('/admin/coupon-management');
        })
    }

}