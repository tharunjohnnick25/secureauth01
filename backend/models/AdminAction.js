const mongoose = require('mongoose');

const adminActionSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  action: {
    type: String,
    required: true,
    index: true
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  details: { type: mongoose.Schema.Types.Mixed },
  ipAddress: { type: String },
  reason: { type: String, required: true }
}, {
  timestamps: true
});

const AdminAction = mongoose.model('AdminAction', adminActionSchema);
module.exports = AdminAction;
