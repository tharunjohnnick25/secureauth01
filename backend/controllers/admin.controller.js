const User = require('../models/User');
const ThreatAlert = require('../models/ThreatAlert');
const LoginActivity = require('../models/LoginActivity');
const Device = require('../models/Device');
const SecurityLog = require('../models/SecurityLog');
const aiService = require('../services/ai.service');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

const blockUser = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const user = await User.findByIdAndUpdate(userId, { isBlocked: true }, { new: true });
    res.json({ success: true, message: 'User blocked', user });
  } catch (error) {
    next(error);
  }
};

const getThreats = async (req, res, next) => {
  try {
    const threats = await ThreatAlert.find({}).sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, threats });
  } catch (error) {
    next(error);
  }
};

const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeThreats = await ThreatAlert.countDocuments({ status: 'active' });
    const loginsLast24h = await LoginActivity.countDocuments({ 
      timestamp: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } 
    });
    
    const riskDistribution = await User.aggregate([
      { $group: { _id: { 
        $cond: [ { $gte: ["$riskScore", 80] }, "Critical", 
          { $cond: [ { $gte: ["$riskScore", 50] }, "High", "Low" ] }
        ]
      }, count: { $sum: 1 } } }
    ]);

    res.json({ 
      success: true, 
      stats: { totalUsers, activeThreats, loginsLast24h, riskDistribution } 
    });
  } catch (error) {
    next(error);
  }
};

const getSecurityLogs = async (req, res, next) => {
  try {
    const logs = await SecurityLog.find({})
      .sort({ createdAt: -1 })
      .limit(100);
    res.json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

const generateThreatReport = async (req, res, next) => {
  try {
    const criticalThreats = await ThreatAlert.find({ severity: 'critical', status: 'active' });
    
    // Use AI to summarize threats if enabled
    let aiSummary = "No active critical threats requiring immediate attention.";
    if (criticalThreats.length > 0) {
      const summaryResult = await aiService.analyzeRiskWithAI({
        type: 'threat_report_summary',
        threats: criticalThreats.map(t => ({ type: t.type, details: t.details }))
      });
      if (summaryResult) aiSummary = summaryResult.reasoning;
    }

    res.json({
      success: true,
      report: {
        generatedAt: new Date(),
        threatCount: criticalThreats.length,
        summary: aiSummary,
        threats: criticalThreats
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  blockUser,
  getThreats,
  getStats,
  getSecurityLogs,
  generateThreatReport
};
