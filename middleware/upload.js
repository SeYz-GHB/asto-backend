import multer from 'multer';
import path from 'path';
import { storage } from '../config/cloudinary.js';
import fs from 'fs';

// ✅ Cloudinary for product images
export const uploadSingle = multer({ storage });

// ✅ Local disk for CSV + image bulk upload
export const uploadBulk = multer({
  storage: multer.memoryStorage(), // ✅ No disk storage
  limits: { fileSize: 5 * 1024 * 1024 }, // optional: 5MB limit per file
}).fields([
  { name: 'csv', maxCount: 1 },
  { name: 'images', maxCount: 100 },
]);

const screenshotStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/payment_screenshots';
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `payment_${Date.now()}${ext}`;
    cb(null, name);
  },
});

export const uploadScreenshot = multer({
  storage: screenshotStorage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, allowed.includes(ext));
  },
});