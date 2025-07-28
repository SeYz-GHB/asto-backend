import express from "express";
import { getMyOrders } from "../controllers/userController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my-orders", authenticate, getMyOrders);

export default router;
