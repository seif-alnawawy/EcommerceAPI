const express = require("express");

const {
  getProducts,
  getProductById,
  uploadProductGallery,
  uploadImage,
  createProduct,
  updateProduct,
  deleteProduct,
  addGalleryImages,
  replaceGalleryImage,
  deleteGalleryImage,
} = require("../controllers/product-controller");
const {
  getProductsValidator,
  createProductValidator,
  getProductValidator,
  updateProductValidator,
  deleteProductValidator,
} = require("../validators/product-validator");
const authController = require("../controllers/auth-controllers");

const router = express.Router({ mergeParams: true });

router.get("/", getProductsValidator, getProducts);
router.get("/:id", getProductValidator, getProductById);

// The below Routes are Allowed only to admin
router.use(
  authController.checkAuthorization,
  authController.allowedTo("admin"),
);

router.post("/", uploadProductGallery, createProductValidator, createProduct);

router
  .route("/:id")
  .put(updateProductValidator, updateProduct)
  .delete(deleteProductValidator, deleteProduct);

router.post("/:productId/gallery", uploadProductGallery, addGalleryImages);
router.patch("/:productId/gallery/:publicId", uploadImage, replaceGalleryImage);
router.delete(
  "/:productId/gallery/:publicId",
  uploadProductGallery,
  deleteGalleryImage,
);

module.exports = router;
