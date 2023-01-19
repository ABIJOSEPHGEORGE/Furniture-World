const eoVerify = require('eoVerify');

module.exports = {
    generateOtp:async(inputEmail)=>{
        let otp = await eoVerify.sendOtp(inputEmail,process.env.COMPANY_NAME);
        return otp;
    },
    resendOtp:async(inputEmail)=>{
        let otp = await eoVerify.resendOtp(inputEmail,process.env.COMPANY_NAME);
        return otp;
    }
}