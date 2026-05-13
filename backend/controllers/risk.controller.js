const RiskScore = require('../models/RiskScore');
const ThreatAlert = require('../models/ThreatAlert');
const LoginActivity = require('../models/LoginActivity');

const getRiskScore = async (req, res, next) => {
  try {
    const risk = await RiskScore.findOne({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, risk });
  } catch (error) {
    next(error);
  }
};

const getThreatAnalysis = async (req, res, next) => {
  try {
    const threats = await ThreatAlert.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, threats });
  } catch (error) {
    next(error);
  }
};

const getSecurityReport = async (req, res, next) => {
  try {
    const recentActivities = await LoginActivity.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
      
    const lastCriticalAlert = await ThreatAlert.findOne({ 
      userId: req.user._id, 
      severity: 'critical' 
    }).sort({ createdAt: -1 });

    res.json({ 
      success: true, 
      report: {
        lastAssessment: new Date(),
        safetyScore: 100 - (req.user.riskScore || 0),
        recentActivities,
        lastCriticalAlert,
        recommendations: [
          'Enable hardware security keys for critical access',
          'Review trusted devices every 30 days',
          'Use unique passwords for integrated services'
        ]
      } 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getRiskScore,
  getThreatAnalysis,
  getSecurityReport
};
