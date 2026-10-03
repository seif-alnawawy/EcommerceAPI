const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const slugify = require("slugify");
const bcrypt = require("bcryptjs");

const ApiError = require("../utils/api-error");
const User = require("../models/user-model");
const handlersFactory = require("./handlers-factory");
const { uploadSingleFile } = require("../middlewares/upload-middleware");
const { deleteImage, uploadImage } = require("../services/cloudinary-service");
const filterObject = require("../utils/filter-object");
const tokenHelper = require("../utils/token-helper");

// @route  get /users
// @access admin
exports.getUsers = handlersFactory.getDocuments(User);

// @route  get /users/:id
// @access admin
exports.getUserById = handlersFactory.getDocumentById(User);

// @route  post /users
// @access admin
exports.uploadUserImage = uploadSingleFile("profileImage");

exports.createUser = handlersFactory.createDocument(User, async (req) => {
  if (!req.file && req.body.profileImage) {
    throw new ApiError("Only image files are allowed.", 400);
  }
  if (!req.file) return;

  req.body.profileImage = await uploadImage(req.file.buffer);
});

// @route  put /users/:id
// @access admin
exports.updateUser = handlersFactory.updateDocument(User, async (user, req) => {
  if (!req.file && req.body.profileImage) {
    throw new ApiError("Only image files are allowed.", 400);
  }
  if (!req.file) return;

  req.body.profileImage = await uploadImage(
    req.file.buffer,
    user.profileImage?.publicId,
  );
});

// @route  delete /users/:id
// @access admin
exports.deleteUser = handlersFactory.deleteDocument(
  User,
  async (deletedUser) => {
    if (deletedUser.profileImage?.publicId) {
      await deleteImage(deletedUser.profileImage.publicId);
    }
  },
);

// @route  put /users/changePassword/:id
// @access admin
exports.changeUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select("password");
  if (!user) {
    return next(new ApiError("User not found.", 404));
  }

  user.password = req.body.password;
  await user.save();

  return res.status(200).json({
    message: `Password updated successfully`,
  });
});

// @route  put /users/me
// @access Private/checkAuthorization
exports.getCurrentUserData = asyncHandler((req, res, next) => {
  req.params.id = req.user._id;
  return next();
});

// @route  put /users/me/changePassword
// @access Private/checkAuthorization
exports.changeCurrentUserPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("password");
  if (!user) {
    return next(new ApiError("User not found", 404));
  }

  const isCurrPasswordCorrect = await bcrypt.compare(
    req.body.currentPassword,
    user.password,
  );
  if (!isCurrPasswordCorrect) {
    return next(new ApiError("Current password is incorrect", 400));
  }

  // Prevent using the same password again
  const isSamePassword = await bcrypt.compare(req.body.password, user.password);
  if (isSamePassword) {
    return next(
      new ApiError(
        "New password must be different from the current password.",
        400,
      ),
    );
  }

  let accessToken;
  const refreshToken = tokenHelper.generateRefreshToken(user._id);

  user.password = req.body.password;
  user.refreshToken = refreshToken;

  await user.save().then((_) => {
    // assign the access token after the save complete
    // so that the token date be greater than paswordChangedAt
    accessToken = tokenHelper.generateAccessToken(user._id);
  });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: 24 * 30 * 60 * 60 * 1000, // 30 days
  });

  return res.status(200).json({
    message: "Password updated successfully",
    accessToken,
  });
});

// @route  put /users/me
// @access Private/CheckAuthorization
exports.updateCurrentUser = asyncHandler(async (req, res, next) => {
  // Upload image if provided
  if (!req.file && req.body.profileImage) {
    return next(new ApiError("Only image files are allowed.", 400));
  }

  if (req.file) {
    req.body.profileImage = await uploadImage(
      req.file.buffer,
      req.user.profileImage?.publicId,
    );
  }

  const updates = filterObject(req.body, [
    "name",
    "email",
    "phone",
    "profileImage",
  ]);
  req.user.set(updates);
  await req.user.save();

  return res.status(200).json({
    message: `Profile updated successfully`,
    data: req.user,
  });
});
