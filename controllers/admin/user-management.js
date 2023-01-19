const User = require("../../models/users-schema")

module.exports = {
    fetchAllUsers:async()=>{
        let allUsers = await User.find({});
        return allUsers;
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