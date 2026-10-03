const express = require("express");

const {
  getBrands,
  createBrand,
  uploadBrandImage,
  getBrandById,
  updateBrand,
  deleteBrand,
} = require("../controllers/brand-controller");

const {
  getBrandValidator,
  createBrandValidator,
  updateBrandValidator,
  deleteBrandValidator,
} = require("../validators/brand-validator");
const productRoutes = require("./product-routes");

const router = express.Router();

router.use("/:brand/products", productRoutes);

router
  .route("/")
  .get(getBrands)
  .post(uploadBrandImage, createBrandValidator, createBrand);

router
  .route("/:id")
  .get(getBrandValidator, getBrandById)
  .put(uploadBrandImage, updateBrandValidator, updateBrand)
  .delete(deleteBrandValidator, deleteBrand);

module.exports = router;
