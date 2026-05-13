const geoip = require('geoip-lite');
const Device = require('../models/Device');
const LoginActivity = require('../models/LoginActivity');
const aiService = require('./ai.service');
const { logger } = require('../utils/logger');

/**
 * Advanced Risk Assessment Service
 */
const calculateRiskScore = async (user, loginContext) => {
  let score = 0;
  const factors = [];
  const { ipAddress, deviceFingerprint, typingMetrics, userAgent } = loginContext;

  // 1. Device Fingerprint Analysis
  const device = await Device.findOne({ userId: user._id, fingerprint: deviceFingerprint });
  if (!device) {
    score += 35;
    factors.push('New/Unknown device detected');
  } else if (!device.isTrusted) {
    score += 15;
    factors.push('Known untrusted device');
  }

  // 2. Geolocation & Impossible Travel
  const geo = geoip.lookup(ipAddress) || { country: 'Unknown', city: 'Unknown', ll: [0, 0] };
  const lastSuccess = await LoginActivity.findOne({ 
    userId: user._id, 
    status: 'success' 
  }).sort({ timestamp: -1 });

  if (lastSuccess && lastSuccess.location && geo.ll) {
    const timeDiffHours = (Date.now() - new Date(lastSuccess.timestamp).getTime()) / (1000 * 60 * 60);
    // Simple distance calculation (simplified)
    const dist = Math.sqrt(
      Math.pow(geo.ll[0] - lastSuccess.location.ll[0], 2) + 
      Math.pow(geo.ll[1] - lastSuccess.location.ll[1], 2)
    ) * 111; // approx km

    if (dist > 500 && timeDiffHours < 2) {
      score += 50;
      factors.push('Impossible travel detected (High speed movement)');
    }
    
    if (lastSuccess.location.country !== geo.country) {
      score += 25;
      factors.push('Login from unusual country');
    }
  }

  // 3. Login Time Anomaly
  const currentHour = new Date().getHours();
  const typicalHours = await LoginActivity.aggregate([
    { $match: { userId: user._id, status: 'success' } },
    { $project: { hour: { $hour: "$timestamp" } } },
    { $group: { _id: "$hour", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);

  const isTypicalTime = typicalHours.some(h => Math.abs(h._id - currentHour) <= 2);
  if (typicalHours.length > 0 && !isTypicalTime) {
    score += 15;
    factors.push('Atypical login time');
  }

  // 4. Typing Biometrics AI Analysis
  if (typingMetrics && user.typingProfile) {
    const aiResult = await aiService.analyzeTypingBehavior(typingMetrics, user.typingProfile);
    if (aiResult.status === 'anomaly') {
      score += 30 * aiResult.confidence;
      factors.push('Abnormal typing rhythm detected');
    }
  }

  // 5. Brute Force Check
  const recentFailures = await LoginActivity.countDocuments({
    ipAddress,
    status: 'failed',
    timestamp: { $gt: new Date(Date.now() - 30 * 60 * 1000) }
  });
  if (recentFailures > 5) {
    score += 45;
    factors.push(`Multiple failed attempts from this IP (${recentFailures})`);
  }

  // 6. Final OpenAI Enrichment (Optional for High Risk)
  if (score > 40) {
    const openAIAnalysis = await aiService.analyzeRiskWithAI({
      user: { id: user._id, email: user.email, riskScore: user.riskScore },
      context: { ipAddress, geo, factors, deviceFingerprint },
      history: { recentFailures }
    });
    if (openAIAnalysis) {
      score = Math.max(score, openAIAnalysis.score);
      factors.push(`AI Analysis: ${openAIAnalysis.reasoning}`);
    }
  }

  // Cap score at 100
  score = Math.min(score, 100);

  // Determine Level
  let level = 'low';
  if (score >= 80) level = 'critical';
  else if (score >= 60) level = 'high';
  else if (score >= 30) level = 'medium';

  return { score, level, factors, geo };
};

module.exports = { calculateRiskScore };
