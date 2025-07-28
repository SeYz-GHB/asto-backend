// controllers/verifyEmail.js

import { sendWelcomeEmail } from "../../mail/mailService/sendWelcomeEmail.js";
import db from "../../models/index.js";
import { generateTokenAndSetCookie } from "../../utils/generateTokenAndSetCookie.js";

export const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  try {
    if (!email || !code) {
      return res.status(400).json({ success: false, message: "Email and verification code are required" });
    }

    const user = await db.User.findOne({
      where : 
      {
        email,
        verification_token : code,
      }
    })
    

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid code or email" });
    }

    const now = new Date();
    if (new Date(user.verification_token_expires_at) < now) {
      return res.status(400).json({ success: false, message: "Verification code has expired" });
    }

    await user.update({
      is_verified: 1,
      verification_token : null,
      verification_token_expires_at : null,
    })
  
    generateTokenAndSetCookie(res, user.id);   // ← THIS LINE ADDS Set-Cookie
    await sendWelcomeEmail(user.email, user.name);


return res.json({
  success: true,
  message: "Email verified successfully!",
  user: {
    id : user.id,
    name :user.name,
    email : user.email ,
    is_verified : 1,
    role : user.role
  }
});

  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
