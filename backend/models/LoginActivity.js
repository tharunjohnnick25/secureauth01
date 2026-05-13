const mongoose = require('mongoose');

const loginActivitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['success', 'failed', 'blocked'],
    required: true
  },
  ipAddress: { type: String, required: true },
  userAgent: { type: String },
  deviceFingerprint: { type: String },
  location: {
    city: String,
    country: String,
    region: String
  },
  riskScore: { type: Number },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical']
  },
  failureReason: { type: String },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const LoginActivity = mongoose.model('LoginActivity', loginActivitySchema);
module.exports = LoginActivity;
