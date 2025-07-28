// Reciever.js
import readline from "readline";
import { sendVerificationEmail } from "./mailService/sendVerificationEmail.js";

// Setup CLI prompt
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Ask user for email
rl.question("📧 Enter the client's email address: ", async (email) => {
  if (!email || !email.includes("@")) {
    console.log("❌ Invalid email.");
    rl.close();
    return;
  }

  const code = generateCode(); // ✅ Now properly defined

  try {
    await sendVerificationEmail(email, code);
    console.log(`✅ Verification code sent to ${email}`);
    console.log(`🔑 Code: ${code}`); // Debug purpose (you can hide this in production)
  } catch (err) {
    console.error("❌ Failed to send email:", err);
  } finally {
    rl.close();
  }
});
