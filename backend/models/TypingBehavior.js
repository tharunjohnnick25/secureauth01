const mongoose = require('mongoose');

const typingBehaviorSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  samples: [{
    metrics: [Number], // The 12-feature vector
    wpm: Number,
    errorRate: Number,
    timestamp: { type: Date, default: Date.now }
  }],
  baseline: [Number], // Averaged 12-feature vector for this user
  lastUpdated: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const TypingBehavior = mongoose.model('TypingBehavior', typingBehaviorSchema);
module.exports = TypingBehavior;
