const User = require('../models/User');
const LoginActivity = require('../models/LoginActivity');
const Session = require('../models/Session');
const Device = require('../models/Device');
const { generateToken, generateRefreshToken } = require('../services/auth.service');
const { calculateRiskScore } = require('../services/risk.service');
const { sendOTPEmail, sendSecurityAlert } = require('../services/notification.service');
const { generateOTP } = require('../utils/crypto');
const { logger } = require('../utils/logger');

// Store temporary OTPs (In-memory for demo, use Redis in production)
const tempOTPStore = new Map();

/**
 * Handle User Registration
 */
const register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    res.status(201).json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Handle Login with Adaptive Auth
 */
const login = async (req, res, next) => {
  try {
    const { email, password, deviceFingerprint, typingMetrics } = req.body;
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      await LoginActivity.create({ status: 'failed', ipAddress, failureReason: 'Invalid credentials' });
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: 'Account blocked due to security reasons' });
    }

    // AI Risk Assessment
    const risk = await calculateRiskScore(user, { ipAddress, deviceFingerprint, typingMetrics, userAgent });

    // Adaptive Auth: If Risk is Critical, block and notify
    if (risk.level === 'critical') {
      await sendSecurityAlert(user.email, { location: `${risk.geo.city}, ${risk.geo.country}`, riskLevel: 'CRITICAL' });
      return res.status(403).json({ 
        message: 'Suspicious login blocked. A security alert has been sent to your email.',
        riskLevel: 'critical'
      });
    }

    // Adaptive Auth: If Risk is High/Medium, require OTP
    if (risk.level === 'high' || risk.level === 'medium') {
      const otp = generateOTP();
      tempOTPStore.set(user.email, { otp, expires: Date.now() + 10 * 60 * 1000, riskData: risk });
      
      await sendOTPEmail(user.email, otp);
      
      return res.status(202).json({
        message: 'Additional verification required',
        requiresOTP: true,
        email: user.email,
        riskLevel: risk.level,
        factors: risk.factors
      });
    }

    // Low Risk: Proceed with login
    const session = await createSession(user, { deviceFingerprint, ipAddress, userAgent });

    res.json({
      success: true,
      token: generateToken(user._id),
      refreshToken: session.refreshToken,
      user: { id: user._id, email: user.email, firstName: user.firstName, role: user.role },
      riskScore: risk.score
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Verify OTP and complete login
 */
const verifyOTP = async (req, res, next) => {
  try {
    const { email, otp, deviceFingerprint } = req.body;
    const stored = tempOTPStore.get(email);

    if (!stored || stored.otp !== otp || stored.expires < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email });
    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const userAgent = req.headers['user-agent'];

    // Create session and cleanup
    const session = await createSession(user, { deviceFingerprint, ipAddress, userAgent });
    tempOTPStore.delete(email);

    res.json({
      success: true,
      token: generateToken(user._id),
      refreshToken: session.refreshToken,
      user: { id: user._id, email: user.email, role: user.role }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh Token handler
 */
const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const session = await Session.findOne({ refreshToken, isValid: true });

    if (!session || session.expiresAt < Date.now()) {
      return res.status(401).json({ message: 'Invalid or expired session' });
    }

    const newToken = generateToken(session.userId);
    res.json({ token: newToken });
  } catch (error) {
    next(error);
  }
};

/**
 * Logout handler
 */
const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await Session.findOneAndUpdate({ refreshToken }, { isValid: false });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

/**
 * Helper: Create database session
 */
async function createSession(user, context) {
  const refreshToken = generateRefreshToken(user._id);
  return await Session.create({
    userId: user._id,
    refreshToken,
    deviceFingerprint: context.deviceFingerprint,
    ipAddress: context.ipAddress,
    userAgent: context.userAgent,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  });
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = generateOTP();
    const OTPVerification = require('../models/OTPVerification');
    
    await OTPVerification.create({
      userId: user._id,
      email,
      otp,
      purpose: 'password_reset',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000)
    });

    await sendOTPEmail(email, otp);

    res.json({ success: true, message: 'Password reset OTP sent to email' });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    const OTPVerification = require('../models/OTPVerification');
    
    const verification = await OTPVerification.findOne({
      email,
      otp,
      purpose: 'password_reset',
      isUsed: false,
      expiresAt: { $gt: Date.now() }
    });

    if (!verification) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    const user = await User.findById(verification.userId);
    user.password = newPassword; // Pre-save hook will hash this
    await user.save();

    verification.isUsed = true;
    await verification.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  verifyOTP,
  refresh,
  logout,
  forgotPassword,
  resetPassword
};
