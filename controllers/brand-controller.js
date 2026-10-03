const Brand = require("../models/brand-model");
const handlersFactory = require("./handlers-factory");
const { uploadSingleFile } = require("../middlewares/upload-middleware");
const { deleteImage, uploadImage } = require("../services/cloudinary-service");
const ApiError = require("../utils/api-error");

// @route  get /brands
exports.getBrands = handlersFactory.getDocuments(Brand);

// @route  get /brands/:id
exports.getBrandById = handlersFactory.getDocumentById(Brand);

exports.uploadBrandImage = uploadSingleFile("image");

// @route  post /brands
exports.createBrand = handlersFactory.createDocument(Brand, async (req) => {
  if (!req.file && req.body.image) {
    throw new ApiError("Only image files are allowed.", 400);
  }
  if (!req.file) return;

  req.body.image = await uploadImage(req.file.buffer);
});

// @route  put /brands/:id
exports.updateBrand = handlersFactory.updateDocument(
  Brand,
  async (brand, req) => {
    if (!req.file && req.body.image) {
      throw new ApiError("Only image files are allowed.", 400);
    }
    if (!req.file) return;

    req.body.image = await uploadImage(req.file.buffer, brand.image?.publicId);
  },
);

// @route  delete /brands/:id
exports.deleteBrand = handlersFactory.deleteDocument(
  Brand,
  async (deletedBrand) => {
    if (deletedBrand.image?.publicId) {
      await deleteImage(deletedBrand.image.publicId);
    }
  },
);
