const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const User = require("../models/user-model");
const ApiError = require("../utils/api-error");
const { sendResetCode } = require("../services/email-service");
const tokenHelper = require("../utils/token-helper");

const getResetCode = () =>
  Math.floor(Math.random() * 900000 + 100000).toString();
const getHashedCode = (code) =>
  crypto.createHash("sha256").update(code).digest("hex");

exports.signup = asyncHandler(async (req, res) => {
  const user = await User.create(req.body);

  res.status(201).json({
    message: "Your account is created successfully, You can login now.",
  });
});

exports.login = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
  }).select("+password");

  if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
    return next(new ApiError("Invalid email or password", 400));
  }

  const accessToken = tokenHelper.generateAccessToken(user._id);
  const refreshToken = tokenHelper.generateRefreshToken(user._id);

  user.refreshToken = refreshToken;
  const result = await user.save();
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 30 * 60 * 60 * 1000, // 30 days
  });

  return res.status(200).json({
    message: "You have logged in",
    accessToken,
    data: user,
  });
});

exports.checkAuthorization = asyncHandler(async (req, res, next) => {
  // Check token existence
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) {
    return next(new ApiError("Not authorized", 401));
  }

  // Verify the sended token
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);

  // ensure that there is a user for this token
  const currentUser = await User.findById(decoded.userId);
  if (!currentUser) {
    return next(new ApiError("User not found", 401));
  }

  // Chack if user changed his password after token created
  if (currentUser.passwordChangedAt) {
    const passwordChangedAt = Math.floor(
      currentUser.passwordChangedAt.getTime() / 1000,
    );
    if (passwordChangedAt > decoded.iat) {
      return next(
        new ApiError("Password has been changed. Please log in again.", 401),
      );
    }
  }
  // to be able to access the user data from other middlewares by req
  req.user = currentUser;
  return next();
});

exports.allowedTo = (...roles) =>
  asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError("You are not allowed to perform this action", 403),
      );
    }
    return next();
  });

exports.forgotPassword = asyncHandler(async (req, res, next) => {
  // Check email existence
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No user found with this email.", 404));
  }

  // generate the reset code and hashing it
  const resetCode = getResetCode();
  const hashedResetCode = getHashedCode(resetCode);

  // Saving the reset code in DB
  user.passwordReset.hashedCode = hashedResetCode;
  user.passwordReset.expiresAt = Date.now() + 10 * 60 * 1000; //  five minutes
  user.passwordReset.verified = false;
  await user.save();

  // Send email
  try {
    await sendResetCode(resetCode, user.email);
  } catch (error) {
    user.passwordReset = undefined;
    await user.save();
    return next(new ApiError("Failed to send email. Please try again later."));
  }

  return res.status(200).json({
    message: "Reset code sent to your email",
  });
});

exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
  // Find the user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No user found with this email.", 404));
  }

  // Check expiration
  if (user.passwordReset.expirationDate < Date.now()) {
    return next(new ApiError("Reset code has expired.", 400));
  }

  // Hash the submitted code and compare
  if (user.passwordReset.hashedCode !== getHashedCode(req.body.resetCode)) {
    return next(new ApiError("Invalid reset code.", 400));
  }

  user.passwordReset.verified = true;
  await user.save();

  return res.status(200).json({
    message: "Success",
  });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Find the user by email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ApiError("No user found with this email.", 404));
  }

  if (!user.passwordReset.verified) {
    return next(new ApiError("Reset code is not verified", 400));
  }

  user.password = req.body.newPassword;
  user.passwordReset = {};
  await user.save();

  return res.status(200).json({
    message: "Password updated successfully.",
  });
});

exports.refreshToken = asyncHandler(async (req, res, next) => {
  if (!req.cookies?.jwt) {
    return next(new ApiError("Not authorized", 401));
  }
  const refreshToken = req.cookies.jwt;

  res.clearCookie("jwt", {
    httpOnly: true,
  });

  const user = await User.findOne({ refreshToken });
  if (!user) {
    return next(new ApiError("", 403));
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
  } catch (error) {
    return next(new ApiError("Invalid or expired refresh token.", 401));
  }

  const accessToken = tokenHelper.generateAccessToken(decoded.userId);

  return res.status(200).json({ accessToken });
});

exports.logout = asyncHandler(async (req, res, next) => {
  if (!req.cookies?.jwt) {
    return res.sendStatus(204);
  }
  const refreshToken = req.cookies.jwt;

  const user = await User.findOne({ refreshToken });
  if (user) {
    user.refreshToken = "";
    const result = await user.save();
  }
  res.clearCookie("jwt", {
    httpOnly: true,
  });

  return res.sendStatus(204);
});
