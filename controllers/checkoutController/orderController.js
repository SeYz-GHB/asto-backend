import db from "../../models/index.js";

export const postOrder = async (req, res) => {
  const { customer_name, phone_number, shipping_address, total, cart } = req.body;

  try {
    if (!customer_name || !phone_number || !shipping_address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user_id = req.user.id;

    // ✅ GET ONLY EXISTING PRODUCTS
    const productIds = cart.map(item => item.id);
    const existingProducts = await db.Product.findAll({
      where: { id: productIds },
      attributes: ['id', 'name', 'price'] // Get price to verify as well
    });
    
    const existingProductIds = existingProducts.map(p => p.id);
    
    // ✅ FILTER TO VALID PRODUCTS ONLY
    const validCartItems = cart.filter(item => existingProductIds.includes(item.id));
    
    if (validCartItems.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: "All products in your cart are no longer available" 
      });
    }
    
    // ✅ RECALCULATE TOTAL FOR VALID ITEMS ONLY
    const newTotal = validCartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const order = await db.Order.create({
      user_id,
      shipping_address,
      customer_name,
      phone_number,
      total_price: newTotal, // Use recalculated total
      status: "pending",
    });

    const orderItems = validCartItems.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    await db.OrderItem.bulkCreate(orderItems);

    // ✅ INFORM USER ABOUT REMOVED ITEMS
    const removedCount = cart.length - validCartItems.length;
    const message = removedCount > 0 
      ? `Order placed successfully! ${removedCount} unavailable item(s) were removed.`
      : "Order placed successfully ✅";

    res.status(201).json({ 
      success: true, 
      message,
      orderId: order.id,
      removedItems: removedCount
    });
  } catch (error) {
    console.error("❌ Order creation error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
 



export const getAllOrder = async (req,res) => {
    try{
        const getOrder = await db.Order.findAll();
        if(getOrder.length === 0){
            return res.status(200).json({message : "no Order yet"});
        }    
        res.status(200).json({success : true, getOrder})
    }catch(error){
        res.status(500).json({success : false, message : error.message})
    }    
}    
export const getSingleOrder = async (req,res) => {
    try {
        const {id} = req.params;
        const getSingleOrder = await db.Order.findOne({
            where  : {id : id}
        });    

        if(!getSingleOrder) {
            return res.status(404).json({success : false, message : "There is no ", id});
        }    
        res.status(200).json({ success: true, getSingleOrder });
        

    }catch(error){
        res.status(500).json({success : false, message : error.message})
    }    
}    

export const getAllOrdersForAdmin = async (req, res) => {
  try {
    // 🔹 Allow both admin and seller
    if (!["admin", "seller"].includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied: Only admins and sellers can view orders.",
      });
    }

    const orders = await db.Order.findAll({
      include: [
        {
          model: db.OrderItem,
          as: "items",
          include: [
            {
              model: db.Product,
              as: "product",
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
    });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("❌ Error in getAllOrdersForAdmin:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

