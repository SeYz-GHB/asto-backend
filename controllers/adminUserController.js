import bcrypt from "bcryptjs";
import db from "../models/index.js";

export const getAllUsers = async (req, res) => {
  try {
    // 🔹 Block non-admin users
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Only admins can view all users.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const offset = (page - 1) * limit;

    const users = await db.User.findAll({
      attributes: { exclude: ["password"] },
      limit,
      offset,
      order: [["id", "ASC"]],
    });

    const totalUsers = await db.User.count();

    res.status(200).json({
      success: true,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      users,
    });
  } catch (error) {
    console.error("❌ getAllUsers error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};



// ✅ Update User
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, address, password } = req.body;

    const user = await db.User.findByPk(id);
    if (!user)
      return res.status(404).json({ success: false, message: "User not found" });

    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.json({
      success: true,
      message: "✅ User updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ Delete User
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await db.User.destroy({ where: { id } });

    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "✅ User deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ (Optional) Get Orders of a User (For Admin)
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const orders = await db.Order.findAll({
      where: { user_id: userId },
      include: [
        { model: db.OrderItem, include: [{ model: db.Product }] },
        { model: db.Payment },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
