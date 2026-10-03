const { check } = require("express-validator");

const validationMiddleware = require("../middlewares/validation-middleware");
const Category = require("../models/category-model");

const checkId = check("id").isMongoId().withMessage("Invalid id");

exports.getSubCategoryValidator = [checkId, validationMiddleware];

exports.getSubCategoriesValidator = [
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category")
    .bail()
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category found for id ${categoryId}`);
      }
      return true;
    }),
  validationMiddleware,
];

exports.createSubCategoryValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("name min length is 3 characters")
    .isLength({ max: 32 })
    .withMessage("name max length is 32 characters"),
  check("category")
    .notEmpty()
    .withMessage("category can not be empty")
    .bail()
    .isMongoId()
    .withMessage("Invalid category")
    .bail()
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category found for id ${categoryId}`);
      }
      return true;
    }),
  validationMiddleware,
];

exports.updateSubCategoryValidator = [
  checkId,
  check("name")
    .optional()
    .trim()
    .bail()
    .isLength({ min: 3 })
    .withMessage("name min length is 3 characters")
    .isLength({ max: 32 })
    .withMessage("name max length is 32 characters"),
  validationMiddleware,
];

exports.deleteSubCategoryValidator = [checkId, validationMiddleware];
