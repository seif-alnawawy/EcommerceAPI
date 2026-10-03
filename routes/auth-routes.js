const express = require("express");
const router = express.Router();

const {
  signup,
  login,
  forgotPassword,
  verifyPasswordResetCode,
  resetPassword,
  refreshToken,
  checkAuthorization,
  logout,
} = require("../controllers/auth-controllers");
const {
  signupValidator,
  loginValidator,
  forgotPasswordValidator,
  verifyPasswordResetCodeValidator,
  resetPasswordValidator,
} = require("../validators/auth-validator");

router.post("/signup", signupValidator, signup);

router.post("/login", loginValidator, login);

router.post("/forgotPassword", forgotPasswordValidator, forgotPassword);

router.post(
  "/verifyPasswordResetCode",
  verifyPasswordResetCodeValidator,
  verifyPasswordResetCode,
);
router.post("/resetPassword", resetPasswordValidator, resetPassword);

router.post("/refresh", refreshToken);

router.post("/logout", checkAuthorization, logout);

module.exports = router;
