const multer = require('multer');
const path = require('path');
const { createBrotliCompress } = require('zlib');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter:(req,file,callback)=>{
        let ext = path.extname(file.originalname);
        if(ext!==".jpg"&&ext!==".jpeg"&&ext!==".png"){
            callback(null,false)
            return callback(new Error('Only .png, .jpg and .jpeg format allowed!'))
        }
       callback(null,true);
    }
})