const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  refreshToken: {
    type: String,
    required: true,
    index: true
  },
  deviceFingerprint: { type: String },
  ipAddress: { type: String },
  userAgent: { type: String },
  isValid: { type: Boolean, default: true },
  expiresAt: { type: Date, required: true },
  lastActive: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Auto-delete expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const Session = mongoose.model('Session', sessionSchema);
module.exports = Session;
