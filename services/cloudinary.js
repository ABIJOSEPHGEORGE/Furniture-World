const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

function uploadImage(filePath) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(filePath, (err, url) => {
      if (err) return reject(err);
      return resolve(url);
    });
  });
}

async function overwriteImage(filePath, publicId) {
  await cloudinary.uploader.upload(
    filePath,
    { public_id: publicId, invalidate: true },
    (err, res) => {
      if (res) return res;
    }
  );
}

async function multipleUpload(imageFiles) {
  return Promise.all(
    imageFiles.map((image) => {
      return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image.path, (err, url) => {
          if (err) return reject(err);
          else resolve({ URL: url.secure_url, cloudinary_id: url.public_id });
        });
      });
    })
  );
}

module.exports = {
  cloudinary: cloudinary,
  uploadImage: uploadImage,
  overwriteImage: overwriteImage,
  multipleUpload: multipleUpload,
};
