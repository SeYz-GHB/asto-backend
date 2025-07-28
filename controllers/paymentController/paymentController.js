// controllers/paymentController.js
import db from '../../models/index.js';
import { generateKHQR } from '../../utils/generateKHQR.js';
import QRCode from 'qrcode';

export const getOrderAmount = async (req, res) => {
  try {
    const { orderId } = req.params;
    
    const order = await db.Order.findByPk(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    
    res.json({ amount: order.total_price });
  } catch (error) {
    console.error("❌ Error fetching order amount:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getPaymentQR = async (req, res) => {
  try {
    const { amount, orderId } = req.query;

    if (!amount || !orderId) {
      return res.status(400).json({ message: "amount and orderId required" });
    }

    // 1️⃣ Generate QR + reference
    const { qrString, referenceId } = generateKHQR({
      merchantName: "ASTO Store",
      accountNumber: "000312730428",
      amount: parseFloat(amount),
    });

    // 2️⃣ Save referenceId to DB
    await db.Order.update(
      { payment_ref: referenceId },
      { where: { id: orderId } }
    );

    // 3️⃣ Generate QR Image
    const qrImage = await QRCode.toDataURL(qrString);

    res.json({ qrImage, referenceId });
  } catch (err) {
    console.error("❌ QR Generation Error:", err);
    res.status(500).json({ message: "QR generation failed" });
  }
};
export const uploadScreenshot = async (req, res) => {
  try {
    const { orderId } = req.body;
    const file = req.file;
    
    if (!file || !orderId) {
      return res.status(400).json({ message: "Screenshot and orderId required" });
    }
    
    // Update payment record with screenshot
    const payment = await db.Payment.findOne({ where: { order_id: orderId } });
    if (!payment) {
      return res.status(404).json({ message: "Payment record not found" });
    }
    
    // Update payment with screenshot path
    await payment.update({
      screenshot_path: file.path,
      status: 'pending_verification'
    });
    
    res.json({ message: "Payment proof uploaded successfully!" });
  } catch (error) {
    console.error("❌ Error uploading screenshot:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};