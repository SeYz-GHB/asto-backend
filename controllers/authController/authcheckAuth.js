import jwt from "jsonwebtoken";
import db from "../../models/index.js";

export const checkAuth = async (req, res) => {
  try {
    const token = req.cookies.token; // Assuming your token is set in cookies

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    const user = await db.User.findByPk(decoded.id,{
      attributes: ['id','name','email','role','is_verified']
    })
    /*  const [users] = await db.execute("SELECT id, name, email, role, is_verified FROM users WHERE id = ?", [decoded.id]);
    const user = users[0]; */

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Authenticated",
      user
    });

  } catch (err) {
    console.error("checkAuth error", err);
    res.status(401).json({ success: false, message: "Invalid token or session expired" });
  }
};