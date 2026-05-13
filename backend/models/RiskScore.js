const mongoose = require('mongoose');

const riskScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  loginActivityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'LoginActivity'
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  level: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    required: true
  },
  factors: [{
    factor: String,
    weight: Number,
    description: String
  }],
  aiAnalysis: {
    reasoning: String,
    confidence: Number,
    engine: String // 'tensorflow' | 'openai'
  }
}, {
  timestamps: true
});

// Index for trend analysis over time
riskScoreSchema.index({ userId: 1, createdAt: -1 });

const RiskScore = mongoose.model('RiskScore', riskScoreSchema);
module.exports = RiskScore;
