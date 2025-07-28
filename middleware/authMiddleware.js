import jwt from "jsonwebtoken";
import db from "../models/index.js";

export const authenticate = async (req, res, next) => {
  try {
    const bearerToken = req.headers.authorization?.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

    const token = bearerToken || req.cookies?.token;

    console.log("🔍 Token found:", !!token);

    if (!token) {
      return res.status(200).json({ message: "true" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("🔍 Decoded token:", decoded);
    
    const user = await db.User.findByPk(decoded.id);
    console.log("🔍 User from database:", user ? { id: user.id, role: user.role, name: user.name } : null);

    /* if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    } */

    req.user = { id: user.id, role: user.role, name: user.name };
    console.log("🔍 req.user set to:", req.user);
    next();
  } catch (err) {
    console.error("❌ Auth error:", err);
  /*   return res.status(403).json({ message: "Invalid or expired token" }); */
  }
};