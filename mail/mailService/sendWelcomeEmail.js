// welcomeEmail.js
import { transporter } from "../mailerConfig.js";

// Optional: HTML version (you can customize this more)
function getWelcomeEmailHtml(name) {
  return `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>👋 Welcome, ${name}!</h2>
      <p>We're excited to have you on board. Let’s build something great together.</p>
      <hr />
      <p style="font-size: 12px; color: #888;">This is an automated message. Please don’t reply.</p>
    </div>
  `;
}

// 📤 Send Welcome Email
export async function sendWelcomeEmail(toEmail, name = "New User") {
  const mailOptions = {
    from: `"WelcomeBot" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: "🎉 Welcome to Our Platform!",
    text: `Hi ${name}, welcome to our platform! We're glad to have you.`,
    html: getWelcomeEmailHtml(name),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Welcome email sent:", info.response);
  } catch (err) {
    console.error("❌ Error sending welcome email:", err);
    throw err;
  }
}
