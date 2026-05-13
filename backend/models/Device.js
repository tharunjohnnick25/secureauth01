const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fingerprint: {
    type: String,
    required: true,
    index: true
  },
  deviceName: { type: String },
  deviceType: { type: String }, // mobile, desktop, tablet
  browser: { type: String },
  os: { type: String },
  isTrusted: { type: Boolean, default: false },
  lastUsed: { type: Date, default: Date.now },
  ipAddress: { type: String },
  location: {
    city: String,
    country: String,
    lat: Number,
    lon: Number
  },
  trustScore: { type: Number, default: 0 },
  riskLevel: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  metadata: { type: Object }
}, {
  timestamps: true
});

// Compound index for faster lookups per user
deviceSchema.index({ userId: 1, fingerprint: 1 }, { unique: true });

const Device = mongoose.model('Device', deviceSchema);
module.exports = Device;
