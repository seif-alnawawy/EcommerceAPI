const { check } = require("express-validator");

const validationMiddleware = require("../middlewares/validation-middleware");

const checkId = check("id").isMongoId().withMessage("Invalid brand id");

exports.getBrandValidator = [checkId, validationMiddleware];

exports.createBrandValidator = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .bail()
    .isLength({ max: 32 })
    .withMessage("name max length is 32 characters"),
  validationMiddleware,
];

exports.updateBrandValidator = [
  checkId,
  check("name")
    .optional()
    .trim()
    .isLength({ max: 32 })
    .withMessage("name max length is 32 characters"),
  validationMiddleware,
];

exports.deleteBrandValidator = [checkId, validationMiddleware];
