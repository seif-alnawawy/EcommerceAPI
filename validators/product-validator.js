const { check } = require("express-validator");
const { Types } = require("mongoose");

const validationMiddleware = require("../middlewares/validation-middleware");
const Category = require("../models/category-model");
const SubCategory = require("../models/sub-category-model");
const Brand = require("../models/brand-model");

const checkId = check("id").isMongoId().withMessage("Invalid product id");
exports.getProductsValidator = [
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid category id")
    .bail()
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category found for id ${categoryId}`);
      }
      return true;
    }),
  check("subCategory")
    .optional()
    .isMongoId()
    .withMessage("Invalid sub category id")
    .bail()
    .custom(async (subCategoryId) => {
      const subCategory = await SubCategory.findById(subCategoryId);
      if (!subCategory) {
        throw new Error(`No sub category found for id ${subCategoryId}`);
      }
      return true;
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand id")
    .bail()
    .custom(async (brandId) => {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        throw new Error(`No brand found for id ${brandId}`);
      }
      return true;
    }),
  validationMiddleware,
];

exports.createProductValidator = [
  check("name")
    .notEmpty()
    .withMessage("Product name is required")
    .bail()
    .isLength({ max: 100 })
    .withMessage("Too long product name"),

  check("description")
    .notEmpty()
    .withMessage("Product description is required")
    .bail()
    .isLength({ min: 10 })
    .withMessage("Too short product description"),

  check("quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .bail()
    .isNumeric()
    .withMessage("Product quantity must be a number"),
  check("sold")
    .optional()
    .isNumeric()
    .withMessage("Product sold times must be a number"),

  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .bail()
    .isNumeric()
    .withMessage("Product price must be a number")
    .toFloat(),

  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("Price after discount must be a number")
    .toFloat()
    .custom((value, { req }) => {
      if (req.body.price <= value) {
        throw new Error(
          "Price after discount must be lower than original price",
        );
      }
      return true;
    }),

  check("colors")
    .optional()
    .customSanitizer((value) => (Array.isArray(value) ? value : [value]))
    .isArray()
    .withMessage("Colors must be an array"),

  check("category")
    .notEmpty()
    .withMessage("Product must belong to a category")
    .bail()
    .isMongoId()
    .withMessage("Invalid category id")
    .bail()
    .custom(async (categoryId) => {
      const category = await Category.findById(categoryId);
      if (!category) {
        throw new Error(`No category found for id ${categoryId}`);
      }
      return true;
    }),
  check("subCategories")
    .optional()
    .customSanitizer((value) => (Array.isArray(value) ? value : [value]))
    .isArray()
    .withMessage("Sub categories must be an array")
    .bail()
    .custom(async (subCategoriesIds) => {
      // Validate each id format
      const invalidId = subCategoriesIds.find(
        (id) => !Types.ObjectId.isValid(id),
      );
      if (invalidId) {
        throw new Error(`Invalid sub category id: ${invalidId}`);
      }

      // Check existence
      const subCategories = await SubCategory.find({
        _id: { $in: subCategoriesIds },
      });

      if (subCategories.length !== subCategoriesIds.length) {
        throw new Error("One or more sub categories don't exist");
      }

      return true;
    }),
  check("brand")
    .optional()
    .isMongoId()
    .withMessage("Invalid brand id")
    .bail()
    .custom(async (brandId) => {
      const brand = await Brand.findById(brandId);
      if (!brand) {
        throw new Error(`No brand found for id ${brandId}`);
      }
      return true;
    }),
  check("rating")
    .optional()
    .isNumeric()
    .withMessage("Rating must be a number")
    .toFloat()
    .isFloat({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  check("ratingQuantity")
    .optional()
    .isNumeric()
    .withMessage("Rating quantity must be a number"),
  validationMiddleware,
];

exports.getProductValidator = [checkId, validationMiddleware];
exports.updateProductValidator = [checkId, validationMiddleware];
exports.deleteProductValidator = [checkId, validationMiddleware];
