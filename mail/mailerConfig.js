// mailerConfig.js
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";

// Recreate __dirname for ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🛠 Go one level up, then into /backend/.env
const envPath = path.resolve(__dirname, "../.env");
dotenv.config({ path: envPath });

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// 🧪 Debug log
console.log("✅ Gmail Config Loaded:", {
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS ? "✔️ loaded" : "❌ missing",
});
