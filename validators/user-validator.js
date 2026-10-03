const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const validationMiddleware = require("../middlewares/validation-middleware");
const User = require("../models/user-model");

const checkId = check("id").isMongoId().withMessage("Invalid user id");

const checkPassword = check("password")
  .notEmpty()
  .withMessage("password is required")
  .bail()
  .isStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minSymbols: 1,
    minNumbers: 1,
  })
  .withMessage(
    "Password minimum length is 8 characters, must contain at least one uppercase letter, one lowercase letter, one number, and one symbol",
  );
const checkConfirmPassword = check("passwordConfirm")
  .notEmpty()
  .withMessage("Password confirmation is required")
  .bail()
  .custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Password and password confirm don't match");
    }
    return true;
  });

const checkRole = check("role")
  .optional()
  .toLowerCase()
  .isIn(["user", "admin"])
  .withMessage("Role must be either user or admin");

const checkPhone = check("phone")
  .optional()
  .isMobilePhone(["ar-EG", "ar-SA"])
  .withMessage("Invalid phone number")
  .bail();

exports.getUserValidator = [checkId, validationMiddleware];

exports.createUserValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("email is not valid")
    .bail(),
  checkPassword,
  checkConfirmPassword,
  check("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("name min length is 3 characters"),
  checkPhone,
  checkRole,
  validationMiddleware,
];

exports.updateUserValidator = [
  check("email").optional().isEmail().withMessage("email is not valid").bail(),
  check("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("name min length is 3 characters"),
  checkPhone,
  checkRole,
  validationMiddleware,
];

exports.changeUserPasswordValidator = [
  checkId,
  checkPassword,
  checkConfirmPassword,
  validationMiddleware,
];

exports.updateCurrentUserValidator = [
  check("name")
    .optional()
    .trim()
    .isLength({ min: 3 })
    .withMessage("name min length is 3 characters"),
  check("email").optional().isEmail().withMessage("email is not valid").bail(),
  checkPhone,
  validationMiddleware,
];

exports.changeCurrentUserPasswordValidator = [
  check("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  checkPassword,
  checkConfirmPassword,
  validationMiddleware,
];

exports.deleteUserValidator = [checkId, validationMiddleware];
