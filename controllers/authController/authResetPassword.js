
import { sendResetSuccessEmail } from "../../mail/mailService/sendResetSuccessEmail.js";
import db from "../../models/index.js";
import bcrypt from "bcryptjs";

export const resetPassword =async (req,res) => {
    try{
        const {token} = req.params;
        const {password} = req.body;

        if(!token || !password){
            return res.status(400).json({ success: false, message: "Please enter and confirm your new password." });

        }
       
        const user = await db.User.findOne({
            where : {reset_password_token : token}
        })
        if(!user){
            return res.status(400).json({success: false, message : "Invalid or expired reset token! "})

        }
        const now = new Date();
        if(user.reset_password_expires_at && new Date(user.reset_password_expires_at) <now){
            return res.status(400).json({success: false, message : "Reset token has expired."});
        }
        const hashedPassword = await bcrypt.hash(password,10);
        
        await user.update({
            password : hashedPassword,
            reset_password_token : null,
            reset_password_expires_at : null
        })

        await sendResetSuccessEmail(user.email);
        return res.json({
            success: true, message : "Password reset successfully."
        })
        



    }
    catch(err){
        console.log(err);
        return res.staus(500).json({success :false, message: err.message})
    }
}