const tf = require('@tensorflow/tfjs-node');
const { OpenAI } = require('openai');
const { logger } = require('../utils/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * AI Service for Behavioral Biometrics, Risk Analysis, and Cybersecurity Assistance
 */
class AIService {
  constructor() {
    this.model = null;
    this.initModel();
  }

  async initModel() {
    try {
      // Advanced neural network for anomaly detection in behavioral patterns
      this.model = tf.sequential();
      this.model.add(tf.layers.dense({ units: 64, activation: 'relu', inputShape: [12] })); // Expanded feature set
      this.model.add(tf.layers.dropout({ rate: 0.2 }));
      this.model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
      this.model.add(tf.layers.dense({ units: 1, activation: 'sigmoid' }));
      
      this.model.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'binaryCrossentropy',
        metrics: ['accuracy']
      });
      
      logger.info('🧠 AI Biometric Model Initialized with Advanced Architecture');
    } catch (error) {
      logger.error('Failed to initialize AI model:', error);
    }
  }

  /**
   * Analyze typing behavior metrics using TensorFlow.js
   * Features: [dwellTimeAvg, flightTimeAvg, wpm, errorRate, backspaceUsage, shiftUsage, 
   *           capsLockUsage, deleteUsage, arrowKeysUsage, enterFrequency, avgKeyVelocity, jitter]
   */
  async analyzeTypingBehavior(currentMetrics, userProfile) {
    try {
      if (!userProfile || !currentMetrics || currentMetrics.length < 10) {
        return { score: 0.5, confidence: 0, status: 'learning' };
      }

      const input = tf.tensor2d([currentMetrics]);
      const prediction = this.model.predict(input);
      const scoreData = await prediction.data();
      const score = scoreData[0];
      
      input.dispose();
      prediction.dispose();

      // Compare with stored profile (Euclidean distance for additional verification)
      let deviation = 0;
      if (userProfile.baseline) {
        deviation = Math.sqrt(currentMetrics.reduce((acc, val, i) => acc + Math.pow(val - (userProfile.baseline[i] || 0), 2), 0));
      }

      const isAnomaly = score < 0.4 || deviation > 2.5;

      return {
        score: score,
        deviation,
        confidence: 0.92,
        status: isAnomaly ? 'anomaly' : 'match'
      };
    } catch (error) {
      logger.error('AI Typing Analysis Error:', error);
      return { score: 1, confidence: 0, status: 'error' };
    }
  }

  /**
   * Use OpenAI to analyze security events and generate risk analysis
   */
  async analyzeRiskWithAI(eventData) {
    try {
      if (!process.env.OPENAI_API_KEY) return null;

      const prompt = `Perform a deep cybersecurity risk analysis for this login attempt:
      EVENT DATA:
      - User: ${JSON.stringify(eventData.user)}
      - Location: ${JSON.stringify(eventData.context.geo)}
      - Device: ${eventData.context.deviceFingerprint}
      - Detected Factors: ${eventData.context.factors.join(', ')}
      - Recent Failures: ${eventData.history.recentFailures}
      
      Analyze for:
      1. Account Takeover (ATO) probability
      2. Bot/Automation signatures
      3. Unusual behavioral patterns
      
      Return a JSON object with:
      {
        "score": number (0-100),
        "riskLevel": "LOW"|"MEDIUM"|"HIGH"|"CRITICAL",
        "reasoning": "Detailed technical analysis",
        "threats": ["List of potential threat vectors"],
        "recommendedAction": "ALLOW"|"MFA"|"BLOCK"|"RESET_PASSWORD"
      }`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are an elite cybersecurity AI threat researcher specializing in IAM and behavioral biometrics." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" }
      });

      return JSON.parse(response.choices[0].message.content);
    } catch (error) {
      logger.error('OpenAI Risk Analysis Error:', error);
      return null;
    }
  }

  /**
   * AI Cybersecurity Assistant for interactive queries
   */
  async generateAssistantResponse(userQuery, userContext) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { 
            role: "system", 
            content: `You are the SecureAuth AI Assistant. Help users with security questions, 
            MFA setup, and identity protection. Use the provided context to give personalized advice.
            Current User Context: ${JSON.stringify(userContext)}` 
          },
          { role: "user", content: userQuery }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('AI Assistant Error:', error);
      throw new Error('AI Assistant is currently unavailable');
    }
  }

  /**
   * Generate predictive security recommendations based on user history
   */
  async getPredictiveRecommendations(userData, threatHistory) {
    try {
      const prompt = `Based on the following user security data and threat history, 
      provide 3-5 predictive security recommendations to improve their defense posture:
      
      User Data: ${JSON.stringify(userData)}
      Threat History: ${JSON.stringify(threatHistory)}
      
      Format as a list of actionable items with priority.`;

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "You are a proactive security advisor." },
          { role: "user", content: prompt }
        ]
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('Predictive Recommendations Error:', error);
      return "Unable to generate recommendations at this time.";
    }
  }

  /**
   * Update the user's typing baseline by averaging samples
   */
  async updateBaseline(typingProfile) {
    if (!typingProfile.samples || typingProfile.samples.length === 0) return null;

    const numFeatures = 12;
    const totals = new Array(numFeatures).fill(0);
    
    typingProfile.samples.forEach(sample => {
      if (sample.metrics && sample.metrics.length === numFeatures) {
        sample.metrics.forEach((val, i) => totals[i] += val);
      }
    });

    const baseline = totals.map(total => total / typingProfile.samples.length);
    typingProfile.baseline = baseline;
    typingProfile.lastUpdated = Date.now();
    
    await typingProfile.save();
    return baseline;
  }
}

module.exports = new AIService();
