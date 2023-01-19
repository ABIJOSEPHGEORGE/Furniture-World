const multer = require('multer');
const path = require('path');
const { createBrotliCompress } = require('zlib');

module.exports = multer({
    storage: multer.diskStorage({}),
    fileFilter:(req,file,callback)=>{
        let ext = path.extname(file.originalname);
        if(ext!==".jpg"&&ext!==".jpeg"&&ext!==".png"){
            throw new Error('Unsupported files')
        }
       callback(null,true);
    }
})