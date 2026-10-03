const cloudinary = require("cloudinary").v2;
const asyncHandler = require("express-async-handler");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// const uploadImage = async (buffer, options = {}) => {
//   const result = await cloudinary.uploader.upload_stream(imagePath, {
//     resource_type: "image",
//     ...options,
//   });
//   return { url: result.secure_url, publicId: result.public_id };
// };

const uploadImage = (buffer, overwritePublicId) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        public_id: overwritePublicId,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }

        return resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(buffer);
  });

const deleteImage = async (imagePublicId) => {
  const result = await cloudinary.uploader.destroy(imagePublicId);
};

module.exports = { uploadImage, deleteImage };
