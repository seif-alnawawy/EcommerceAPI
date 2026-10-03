const express = require("express");

const {
  getSubCategories,
  getSubCategoryById,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} = require("../controllers/sub-category-controller");
const {
  getSubCategoriesValidator,
  createSubCategoryValidator,
  getSubCategoryValidator,
  updateSubCategoryValidator,
  deleteSubCategoryValidator,
} = require("../validators/sub-category-validator");
const productRoutes = require("./product-routes");
const {
  checkAuthorization,
  allowedTo,
} = require("../controllers/auth-controllers");

const router = express.Router({ mergeParams: true });

router.use("/:subCategories/products", productRoutes);

router.get("/", getSubCategoriesValidator, getSubCategories);
router.get("/:id", getSubCategoryValidator, getSubCategoryById);

// The below Routes are Allowed only to admin
router.use(checkAuthorization, allowedTo("admin"));

router.post("/", createSubCategoryValidator, createSubCategory);

router
  .route("/:id")
  .put(updateSubCategoryValidator, updateSubCategory)
  .delete(deleteSubCategoryValidator, deleteSubCategory);

module.exports = router;
