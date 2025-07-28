import express from "express";
const router = express.Router();

import { uploadSingle } from "../middleware/upload.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { uploadSingleProduct } from "../controllers/productController/createSingleProduct.js";

import { uploadBulk } from "../middleware/upload.js";
import { uploadBulkProducts } from "../controllers/productController/createProductBulk.js";

import {
  getPaginatedProducts,
  getProductById,
  getProductsByBrand,
  getProductsByBrandAndCategory,
} from "../controllers/productController/getProductController.js";

// Routes
router.post(
  "/bulk",
  authenticate,
  authorizeRoles("seller", "admin"),
  uploadBulk,
  uploadBulkProducts
);

router.post(
  "/single_product",
  authenticate,
  authorizeRoles("seller", "admin"),
  uploadSingle.single("image"),
  uploadSingleProduct
);

router.get("/", getPaginatedProducts);
router.get("/brand/:slug", getProductsByBrand);
router.get("/:slug/:brandName", getProductsByBrandAndCategory);
router.get("/:id", getProductById);

export default router;
