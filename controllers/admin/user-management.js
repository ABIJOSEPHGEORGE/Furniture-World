const User = require("../../models/users-schema")

module.exports = {
    //fetching all users data 
    usersManagement:async(req,res)=>{
        try{
            let allUsers = await User.find({});
            if(allUsers) res.render('user-management',{users:allUsers});
        }catch(err){
            console.log(err);
            res.status(503).send("can't fetch users try after sometimes");
        }
    },
    updateStatus:async(id,status)=>{
       let update = await User.findByIdAndUpdate(id,{status:status});
       return update ? true : false;
    },
    deleteUser:async(id)=>{
        let status = await User.findByIdAndDelete(id);
        return status ? true : false;
    },
    searchUserCntrlr:async(search_key)=>{
    let data = await User.find({
        "$or":[
            {first_name:{$regex:search_key}},
            {last_name:{$regex:search_key}},
            {email:{$regex:search_key}},
        ]
    })
    return data;
    },
}