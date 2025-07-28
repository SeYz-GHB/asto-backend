
import bcrypt from "bcryptjs";
import { generateTokenAndSetCookie } from "../../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail } from "../../mail/mailService/sendVerificationEmail.js";
import { generateCode } from "../../mail/mailService/verficationCodeGen.js";
import db from "../../models/index.js";

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    if (!email || !password || !name) {
      throw new Error("All fields are required");
    }

    const existingUsers = await db.User.findOne({where : {email}});

    if (existingUsers) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = generateCode(); 
    const verification_token_expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); 

    const newUser = await db.User.create({
      name,
      email,
      password : hashedPassword,
      verification_token : verificationToken,
      verification_token_expires_at,
    })

    
   
    generateTokenAndSetCookie(res, newUser.id);

    await sendVerificationEmail(newUser.email, verificationToken); 
    console.log(newUser.email,verificationToken)

    res.status(201).json({
      success: true,
      message:
        "User registered successfully! Please check your email for the verification code.",
      user:{
        id : newUser.id,
        name : newUser.name,
        email : newUser.email,
        role : newUser.role,
        is_verified : 1,
        verification_token : verificationToken,
      
      }
    });

    console.log(newUser);

  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};