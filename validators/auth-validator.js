const { check } = require("express-validator");
const bcrypt = require("bcryptjs");

const validationMiddleware = require("../middlewares/validation-middleware");
const User = require("../models/user-model");

exports.loginValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("email is not valid")
    .bail(),
  check("password")
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
    ),
];

exports.signupValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("email is not valid")
    .bail(),
  check("password")
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
    ),
  check("name")
    .trim()
    .notEmpty()
    .withMessage("name is required")
    .bail()
    .isLength({ min: 3 })
    .withMessage("name min length is 3 characters"),
  check("phone")
    .optional()
    .isMobilePhone(["ar-EG", "ar-SA"])
    .withMessage("Invalid phone number")
    .bail(),
  validationMiddleware,
];

exports.forgotPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("email is not valid")
    .bail(),
  validationMiddleware,
];

exports.verifyPasswordResetCodeValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("email is not valid")
    .bail(),
  check("resetCode")
    .notEmpty()
    .withMessage("resetCode is required")
    .bail()
    .isNumeric()
    .withMessage("resetCode must be 6 numbers")
    .bail()
    .isLength({ min: 6, max: 6 })
    .withMessage("resetCode must be 6 numbers"),
  validationMiddleware,
];

exports.resetPasswordValidator = [
  check("email")
    .notEmpty()
    .withMessage("email is required")
    .bail()
    .isEmail()
    .withMessage("email is not valid")
    .bail(),
  check("newPassword")
    .notEmpty()
    .withMessage("New password is required")
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
    ),
  validationMiddleware,
];
