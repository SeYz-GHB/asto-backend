import db from "../models/index.js";


// ✅ Fixed getMyOrders Controller
export const getMyOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const orders = await db.Order.findAll({
      where: { user_id: req.user.id },
      include: [
        { 
          model: db.OrderItem,
          as: 'items', // ← Correct alias
          include: [{ 
            model: db.Product,
            as: 'product' // ← Correct alias
          }]
        },
        { 
          model: db.Payment,
          // No alias needed here since you didn't define one
          required: false // Makes it a LEFT JOIN
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("🔥 getMyOrders Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
