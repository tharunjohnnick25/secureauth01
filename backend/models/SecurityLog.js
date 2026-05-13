const mongoose = require('mongoose');

const securityLogSchema = new mongoose.Schema({
  event: {
    type: String,
    required: true,
    index: true
  },
  severity: {
    type: String,
    enum: ['info', 'warning', 'error', 'critical'],
    default: 'info'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  ipAddress: { type: String },
  details: { type: mongoose.Schema.Types.Mixed },
  userAgent: { type: String },
  resource: { type: String }, // The API endpoint or resource accessed
  action: { type: String }    // The action performed (read, write, delete, etc)
}, {
  timestamps: true
});

// TTL index for high-volume logs (e.g., keep for 90 days)
securityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

const SecurityLog = mongoose.model('SecurityLog', securityLogSchema);
module.exports = SecurityLog;
