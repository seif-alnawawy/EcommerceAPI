const fs = require("fs");

const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const Product = require("../models/product-model");
const handlersFactory = require("./handlers-factory");
const ApiError = require("../utils/api-error");
const uploadMiddleware = require("../middlewares/upload-middleware");
const cloudinaryService = require("../services/cloudinary-service");

// @route  get /products
exports.getProducts = handlersFactory.getDocuments(Product);

// @route  get /products/:id
exports.getProductById = handlersFactory.getDocumentById(Product);

exports.uploadImage = uploadMiddleware.uploadSingleFile("image");
exports.uploadProductGallery = uploadMiddleware.uploadMixOfImages([
  {
    name: "coverImage",
    maxCount: 1,
  },
  {
    name: "gallery",
    maxCount: 5,
  },
]);

// @route  post /products
exports.createProduct = handlersFactory.createDocument(Product, async (req) => {
  // handle cover image
  if (!req.files.coverImage) {
    throw new ApiError("Cover image is required", 400);
  }
  req.body.coverImage = await cloudinaryService.uploadImage(
    req.files.coverImage[0].buffer,
  );

  // handle gallery
  if (!req.files?.gallery) {
    throw new ApiError("At least one gallery image is required", 400);
  }
  req.body.gallery = await Promise.all(
    req.files.gallery.map(
      async (image) => await cloudinaryService.uploadImage(image.buffer),
    ),
  );
});

// @route  put /products/:id
exports.updateProduct = handlersFactory.updateDocument(
  Product,
  async (product, req) => {
    if (!req.file && req.body.coverImage) {
      throw new ApiError("Only image files are allowed.", 400);
    }
    if (!req.file) return;

    req.body.coverImage = await cloudinaryService.uploadImage(
      req.file.buffer,
      product.coverImage?.publicId,
    );
  },
);

// @route  delete /products/:id
exports.deleteProduct = handlersFactory.deleteDocument(Product);

exports.addGalleryImages = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    return next(new ApiError("Product not found", 404));
  }

  if (!req.files?.gallery || req.files?.gallery.length < 1) {
    throw new ApiError("At least one gallery image is required", 400);
  }
  // gallery max length is five
  if (product.gallery.length + req.files?.gallery.length > 5) {
    throw new ApiError("There can't be more than five images in gallery", 400);
  }

  // call the image service and extract the url and public
  req.body.gallery = await Promise.all(
    req.files.gallery.map(
      async (image) => await cloudinaryService.uploadImage(image.buffer),
    ),
  );

  // update the product gallery
  product.gallery.push(...req.body.gallery);
  await product.save();

  return res.status(200).json({
    message: "Image updated successfully",
  });
});

exports.replaceGalleryImage = asyncHandler(async (req, res, next) => {
  const { publicId, productId } = req.params;
  const product = await Product.findOne({
    _id: productId,
    "gallery.publicId": publicId,
  });
  if (!product) {
    return next(new ApiError("Image not found", 404));
  }

  // check uploading the new image
  if (!req.file) {
    throw new ApiError("image is required", 400);
  }
  // replace it in cloudinary
  const newImage = await cloudinaryService.uploadImage(
    req.file.buffer,
    publicId,
  );
  // update the product gallery with the new image
  const image = product.gallery.find((value) => value.publicId === publicId);
  image.url = newImage.url;
  image.publicId = newImage.publicId;

  return res.status(200).json({
    message: "Gallery image updated successfully",
  });
});

exports.deleteGalleryImage = asyncHandler(async (req, res, next) => {
  const { publicId, productId } = req.params;
  const product = await Product.findOne({
    _id: productId,
    "gallery.publicId": publicId,
  });
  if (!product) {
    return next(new ApiError("Image not found", 404));
  }
  if (product.gallery.length <= 1) {
    return next(
      new ApiError("There must be at least one image in gallery", 400),
    );
  }
  await cloudinaryService.deleteImage(publicId);
  product.gallery = product.gallery.filter(
    (image) => image.publicId !== publicId,
  );
  await product.save();

  return res.status(200).json({
    message: "Gallery image deleted successfully",
  });
});
