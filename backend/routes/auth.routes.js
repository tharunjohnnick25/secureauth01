const express = require('express');
const router = express.Router();
const { login, verifyOTP, refresh, logout, register, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const { authLimiter } = require('../middleware/rateLimiter');
const { authMiddleware } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { 
  registerSchema, 
  loginSchema, 
  forgotPasswordSchema, 
  resetPasswordSchema, 
  verifyOTPSchema 
} = require('../utils/validationSchemas');

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/verify-otp', authLimiter, validate(verifyOTPSchema), verifyOTP);
router.post('/refresh', refresh);
router.post('/logout', authMiddleware, logout);
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), resetPassword);

module.exports = router;
