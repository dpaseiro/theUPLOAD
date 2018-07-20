const cloudinary = require('cloudinary');
const cloudinaryStorage = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.cloudName,
  api_key: process.env.cloudKey,
  api_secret: process.env.cloudSecret
});

var theStorage = cloudinaryStorage({
  cloudinary: cloudinary,
  folder: 'folder-name', // The name of the folder in cloudinary
  allowedFormats: ['jpg', 'png', 'mp4', 'mov'],
  filename: function (req, file, cb) {
      resource_type = "video"
    cb(null, 'my-file-name'); // The file on cloudinary would have the same name as the original file name
  }
});

const uploadCloud = multer({ storage: theStorage });

module.exports = uploadCloud;