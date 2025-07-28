import express from 'express';
import db from '../models/index.js'; // ✅ Import db
import { postOrder } from '../controllers/checkoutController/orderController.js';
import { getOrderAmount } from '../controllers/paymentController/paymentController.js';

const router = express.Router();
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

router.post(
  "/Recipt-generator",
  authenticate,                     // ✅ get req.user
  authorizeRoles("customer", "admin"), // ✅ allow both roles
  postOrder
);


// Get order amount by orderId
router.get('/order/:orderId', getOrderAmount);


router.put('/mark-paid/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await db.Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    await order.update({
      status: 'paid',
      paid_at: new Date(), 
    });

    res.json({ message: 'Order marked as paid (demo)' });
  } catch (err) {
  console.error("❌ Error marking paid:", err);
  res.status(500).json({ error: err.message });
}

});

export default router;
