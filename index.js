import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import db from "./models/index.js";

import authRoutes from "./routes/authRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import checkoutRoutes from "./routes/checkoutRoutes.js";
import brandRoutes from "./routes/brandRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";

const app = express();

// ✅ Define CORS only ONCE with both allowed origins
app.use(
  cors({
    origin: [
      "http://localhost:5173",      // local dev
      "https://www.asto-gear.com", // production frontend
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/", brandRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/user", userProfileRoutes); // ✅ Correct route for profile

const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log("✅ MySQL connection via Sequelize established");
    await db.sequelize.sync();
    app.listen(PORT, () =>
      console.log(`🚀 Server running at http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();
