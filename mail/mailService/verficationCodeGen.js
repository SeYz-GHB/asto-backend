
// ✅ Centralized verification code generator
export function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

