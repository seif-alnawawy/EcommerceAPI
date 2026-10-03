const express = require("express");
const router = express.Router();

const {
  getUsers,
  getUserById,
  uploadUserImage,
  createUser,
  updateUser,
  changeUserPassword,
  deleteUser,
  getCurrentUserData,
  updateCurrentUser,
  changeCurrentUserPassword,
} = require("../controllers/user-controller");
const {
  getUserValidator,
  createUserValidator,
  changeUserPasswordValidator,
  updateUserValidator,
  deleteUserValidator,
  updateCurrentUserValidator,
  changeCurrentUserPasswordValidator,
} = require("../validators/user-validator");
const {
  checkAuthorization,
  allowedTo,
} = require("../controllers/auth-controllers");

// The below Routes are Allowed to logged in users only
router.use(checkAuthorization);

router.get("/me", getCurrentUserData, getUserById);

router.patch(
  "/me",
  uploadUserImage,
  updateCurrentUserValidator,
  updateCurrentUser,
);

router.patch(
  "/me/changePassword",
  changeCurrentUserPasswordValidator,
  changeCurrentUserPassword,
);

// The below Routes are Allowed only to admin
router.use(allowedTo("admin"));

router
  .route("/")
  .get(getUsers)
  .post(uploadUserImage, createUserValidator, createUser);

router
  .route("/:id")
  .get(getUserValidator, getUserById)
  .put(uploadUserImage, updateUserValidator, updateUser)
  .delete(deleteUserValidator, deleteUser);

router.put(
  "/changePassword/:id",
  changeUserPasswordValidator,
  changeUserPassword,
);

module.exports = router;
