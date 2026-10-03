const express = require("express");

const {
  getCategories,
  createCategory,
  uploadCategoryImage,
  deleteImageFromCloudinary,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/category-controller");
const subCategoryRoutes = require("./sub-category-routes");
const productRoutes = require("./product-routes");
const authController = require("../controllers/auth-controllers");
const {
  getCategoryValidator,
  createCategoryValidator,
  updateCategoryValidator,
  deleteCategoryValidator,
} = require("../validators/category-validator");

const router = express.Router();

router.use("/:category/subCategories", subCategoryRoutes);
router.use("/:category/products", productRoutes);

router.get("/", getCategories);
router.get("/:id", getCategoryValidator, getCategoryById);

// The below Routes are Allowed only to admin
router.use(
  authController.checkAuthorization,
  authController.allowedTo("admin"),
);

router.post("/", uploadCategoryImage, createCategoryValidator, createCategory);

router
  .route("/:id")
  .put(uploadCategoryImage, updateCategoryValidator, updateCategory)
  .delete(deleteCategoryValidator, deleteCategory);

module.exports = router;
