import express from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/adminUserController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";
import { getMyOrders } from "../controllers/adminUserController.js";
const router = express.Router();

// Only admins can manage users
router.get("/", authenticate, authorizeRoles("seller","admin"), getAllUsers);
router.patch("/:id", authenticate, authorizeRoles("admin"), updateUser);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteUser);
router.get("/my-orders", authenticate, getMyOrders);
export default router;
