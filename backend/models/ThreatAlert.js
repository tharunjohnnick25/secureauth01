const mongoose = require('mongoose');

const threatAlertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['brute_force', 'credential_stuffing', 'impossible_travel', 'suspicious_device', 'vpn_detected', 'unusual_behavior'],
    required: true
  },
  severity: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'ignored'],
    default: 'active'
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  location: {
    city: String,
    country: String
  },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  resolutionNote: { type: String }
}, {
  timestamps: true
});

const ThreatAlert = mongoose.model('ThreatAlert', threatAlertSchema);
module.exports = ThreatAlert;
