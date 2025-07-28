import {transporter} from '../mailerConfig.js'
export const sendPasswordResetEmail = async (email,resetURL)=> {
    const mailOptions = {
        from : `Support team <${process.env.MAIL_USER}>`,
        to : email,
        subject : " Reset your password",
        html : `<div style="font-family: Arial; padding: 20px;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetURL}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>If you did not request this, please ignore this email.</p>
        <p>This link will expire in 1 hour.</p>
      </div>`
    }
    try{
        await transporter.sendMail(mailOptions);
        console.log(`password reset email set to ${email}`);

    }catch(err){
        console.log("fail to send reset email : ",err);
        throw new Error("failed to send reset email");
    }

}