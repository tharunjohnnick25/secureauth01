const { logger } = require('../utils/logger');

/**
 * Middleware to protect specific API endpoints with an API Key
 * Useful for machine-to-machine communication or internal tools
 */
const apiKeyProtection = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const validApiKey = process.env.INTERNAL_API_KEY;

  if (!validApiKey) {
    logger.error('INTERNAL_API_KEY is not defined in environment variables');
    return next(); // If not configured, we might want to skip or fail closed. Let's skip with a warning for now.
  }

  if (!apiKey || apiKey !== validApiKey) {
    logger.warn(`Unauthorized API Key access attempt from IP: ${req.ip}`);
    return res.status(401).json({
      message: 'Unauthorized: Invalid or missing API Key',
    });
  }

  next();
};

module.exports = { apiKeyProtection };
