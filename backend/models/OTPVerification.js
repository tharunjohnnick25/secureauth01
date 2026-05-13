const mongoose = require('mongoose');

const otpVerificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  email: {
    type: String,
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['login', 'password_reset', 'email_verification', 'sensitive_action'],
    default: 'login'
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // Auto-delete on expiry
  },
  isUsed: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const OTPVerification = mongoose.model('OTPVerification', otpVerificationSchema);
module.exports = OTPVerification;
