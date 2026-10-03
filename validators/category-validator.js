const { check } = require("express-validator");

const validationMiddleware = require("../middlewares/validation-middleware");

const checkId = check("id").isMongoId().withMessage("Invalid category id");

exports.getCategoryValidator = [checkId, validationMiddleware];
exports.createCategoryValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("name min length is 3 characters")
    .isLength({ max: 32 })
    .withMessage("name max length is 32 characters"),
  validationMiddleware,
];
exports.updateCategoryValidator = [
  checkId,
  check("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("name min length is 3 characters")
    .isLength({ max: 32 })
    .withMessage("name max length is 32 characters"),
  validationMiddleware,
];
exports.deleteCategoryValidator = [checkId, validationMiddleware];
