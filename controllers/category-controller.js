const Category = require("../models/category-model");
const handlersFactory = require("./handlers-factory");
const { uploadSingleFile } = require("../middlewares/upload-middleware");

const { deleteImage, uploadImage } = require("../services/cloudinary-service");
const ApiError = require("../utils/api-error");
// @route  get /categories
// @access public
exports.getCategories = handlersFactory.getDocuments(Category);

// @route  get /categories/:id
// @access public
exports.getCategoryById = handlersFactory.getDocumentById(Category);

exports.uploadCategoryImage = uploadSingleFile("image");

// @route  post /categories
// @access admin
exports.createCategory = handlersFactory.createDocument(
  Category,
  async (req) => {
    if (!req.file && req.body.image) {
      throw new ApiError("Only image files are allowed.", 400);
    }
    if (!req.file) return;

    req.body.image = await uploadImage(req.file.buffer);
  },
);

// @route  put /categories/:id
// @access admin
exports.updateCategory = handlersFactory.updateDocument(
  Category,
  async (category, req) => {
    if (!req.file && req.body.image) {
      throw new ApiError("Only image files are allowed.", 400);
    }
    if (!req.file) return;

    req.body.image = await uploadImage(
      req.file.buffer,
      category.image?.publicId,
    );
  },
);

// @route  delete /categories/:id
// @access admin
exports.deleteCategory = handlersFactory.deleteDocument(
  Category,
  async (deletedCategory) => {
    if (deletedCategory.image?.publicId) {
      await deleteImage(deletedCategory.image.publicId);
    }
  },
);
