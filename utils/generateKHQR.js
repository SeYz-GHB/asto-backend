function pad(val) {
  return val.toString().padStart(2, "0");
}

function formatTag(id, value) {
  return `${id}${pad(value.length)}${value}`;
}

function crc16(buffer) {
  let crc = 0xffff;
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xffff).toString(16).toUpperCase().padStart(4, "0");
}

export function generateKHQR({
  merchantName = "ASTO Store",
  accountNumber = "000312730428",
  amount,
}) {
  const formattedAccount = accountNumber.replace(/\s/g, "");
  
  // ✅ Generate unique reference for each QR
  const uniqueRef = `ORD${Date.now()}`;

  const payload = [
    formatTag("00", "01"),
    formatTag("01", "12"), // Dynamic QR (with amount)

    formatTag(
      "29",
      [
        formatTag("00", "khqr@aclb"),
        formatTag("01", formattedAccount),
        formatTag("02", "ACLEDA"),
        formatTag("39", "0001185519503"), // Internal bank reference (optional)
      ].join("")
    ),

    formatTag("52", "0000"),
    formatTag("53", "840"), // 840 = USD (use 116 for KHR)
    formatTag("54", amount.toFixed(2)),
    formatTag("58", "KH"),
    formatTag("59", merchantName.substring(0, 25)),
    formatTag("60", "PHNOM PENH"),

    // ✅ Unique reference for each payment
    formatTag("62", formatTag("01", uniqueRef)),
  ];

  const fullPayload = payload.join("") + "6304";
  const checksum = crc16(fullPayload);

  return { qrString: fullPayload + checksum, referenceId: uniqueRef };
}
