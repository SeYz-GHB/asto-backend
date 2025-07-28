import express from 'express';
import { signup } from '../controllers/authController/authSignup.js';
import { verifyEmail } from '../controllers/authController/authverifyEmail.js';
import { login } from '../controllers/authController/authLogin.js';
import { logout } from '../controllers/authController/authLogout.js';
import { forgotPassword } from '../controllers/authController/authForgotPassword.js';
import { resetPassword } from '../controllers/authController/authResetPassword.js';
import { checkAuth } from '../controllers/authController/authcheckAuth.js';

import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/check-auth",checkAuth,authenticate);
router.post('/signup', signup);
router.post('/login', login);

router.post('/logout',logout)
router.post('/verify-email',verifyEmail);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:token",resetPassword);
export default router;