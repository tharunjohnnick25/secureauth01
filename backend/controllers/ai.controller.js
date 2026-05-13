const aiService = require('../services/ai.service');
const LoginActivity = require('../models/LoginActivity');
const ThreatAlert = require('../models/ThreatAlert');
const { logger } = require('../utils/logger');

/**
 * AI Controller for AI Assistant and Predictive Security
 */
const getAssistantResponse = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Get user context for personalized assistance
    const userContext = {
      email: req.user.email,
      role: req.user.role,
      mfaEnabled: req.user.mfaEnabled,
      riskScore: req.user.riskScore,
    };

    const response = await aiService.generateAssistantResponse(message, userContext);
    res.status(200).json({ response });
  } catch (error) {
    logger.error('Assistant Controller Error:', error);
    res.status(500).json({ message: 'Error processing AI assistant request' });
  }
};

const getRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Fetch user history for analysis
    const loginHistory = await LoginActivity.find({ userId }).limit(10).sort({ timestamp: -1 });
    const recentAlerts = await ThreatAlert.find({ userId }).limit(5).sort({ timestamp: -1 });

    const userData = {
      email: req.user.email,
      mfaEnabled: req.user.mfaEnabled,
      loginCount: await LoginActivity.countDocuments({ userId, status: 'success' }),
      riskScore: req.user.riskScore,
    };

    const recommendations = await aiService.getPredictiveRecommendations(userData, {
      recentLogins: loginHistory,
      alerts: recentAlerts
    });

    res.status(200).json({ recommendations });
  } catch (error) {
    logger.error('Recommendations Controller Error:', error);
    res.status(500).json({ message: 'Error generating security recommendations' });
  }
};

module.exports = {
  getAssistantResponse,
  getRecommendations,
};
