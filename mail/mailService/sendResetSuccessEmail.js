import { transporter } from "../mailerConfig.js";

export const sendResetSuccessEmail = async (email) => {
  const mailOptions = {
    from: `Asto <${process.env.MAIL_USER}>`,
    to: email,
    subject: "✅ Password Reset Successful",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Successfully Reset</h2>
        <p>Hello,</p>
        <p>Your password has been successfully changed. If you didn’t do this, please contact support immediately.</p>
        <p style="color: gray;">– Asto Security Team</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset success email sent to ${email}`);
    return true;
  } catch (err) {
    console.error("❌ Failed to send success email:", err);
    throw new Error("Failed to send password reset success email");
  }
};
