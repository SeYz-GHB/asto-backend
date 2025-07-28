
import crypto from 'crypto'
import db from "../../models/index.js";
import { sendPasswordResetEmail } from '../../mail/mailService/sendPasswordResetEmail.js';

export const forgotPassword = async (req,res) => {

    const {email} = req.body;
    try{
        if(!email){
            return res.status(400).send("the email is required!");
        }

        const user = await db.User.findOne({where : {email}});
        if(!user){
            return res.status(404).send("the email is not valid");
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour from now, as Date object

       

         await user.update({
            reset_password_token: resetToken,
            reset_password_expires_at: resetTokenExpiresAt,
        });

        await sendPasswordResetEmail(user.email,`${process.env.CLIENT_URL}/reset-password/${resetToken}`)
        res.status(200).json({success : true, message : "Password reset links sent to your email"})
    }
    catch(err){
        console.log(err);
        res.status(400).json({success : false,message : err.message})
    }

}