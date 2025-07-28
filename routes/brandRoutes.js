import express from 'express';
import { uploadSingle } from '../middleware/upload.js';
import {
  createBrands,
  deleteBrands,
  getBrands,
  getBrandsByCategory,
} from '../controllers/brandController/BrandController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { getProductsByBrandAndCategory } from '../controllers/productController/getProductController.js';

const router = express.Router();

// Only admin can create brands
router.post('/brands', authenticate, authorizeRoles("admin"), uploadSingle.single("image"), createBrands);

// All authenticated users can view brands
router.get('/brands', authenticate, getBrands);

// Only admin can delete brands
router.delete('/brands/:id', authenticate, authorizeRoles("admin"), deleteBrands);

// Public routes
router.get('/brands-by-category/:slug', getBrandsByCategory);
router.get('/products-by-brand/:slug/:brandName', getProductsByBrandAndCategory);

export default router;