const SubCategory = require("../models/sub-category-model");
const handlersFactory = require("./handlers-factory");

// @route  get /subCategories
exports.getSubCategories = handlersFactory.getDocuments(SubCategory);

// @route  get /subCategories/:id
exports.getSubCategoryById = handlersFactory.getDocumentById(SubCategory);

// @route  post /subCategories
exports.createSubCategory = handlersFactory.createDocument(SubCategory);

// @route  put /subCategories/:id
exports.updateSubCategory = handlersFactory.updateDocument(SubCategory);

// @route  delete /subCategories/:id
exports.deleteSubCategory = handlersFactory.deleteDocument(SubCategory);
