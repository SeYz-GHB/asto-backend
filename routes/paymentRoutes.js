import express from 'express';
import { getPaymentQR, uploadScreenshot, getOrderAmount } from '../controllers/paymentController/paymentController.js';
import { uploadScreenshot as uploadMiddleware } from '../middleware/upload.js';
import { getAllOrdersForAdmin } from '../controllers/checkoutController/orderController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';

const router = express.Router();

// ✅ Get total amount for the order
router.get('/order/:orderId', getOrderAmount);

// ✅ Generate KHQR image based on amount
router.get('/qr', getPaymentQR);

// ✅ Upload screenshot as proof of payment
router.post('/upload-proof', uploadMiddleware.single('screenshot'), uploadScreenshot);

// ✅ Added admin/seller route to view all orders
router.get(
  '/admin-orders',
  authenticate,
  authorizeRoles('admin', 'seller'),
  getAllOrdersForAdmin
);

export default router;
