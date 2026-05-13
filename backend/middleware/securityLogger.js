const SecurityLog = require('../models/SecurityLog');

/**
 * Middleware to log security-sensitive requests
 */
const securityLogger = async (req, res, next) => {
  // We log after the response is sent or if it's a sensitive method
  const sensitiveMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
  
  if (sensitiveMethods.includes(req.method)) {
    try {
      await SecurityLog.create({
        event: `${req.method} ${req.originalUrl}`,
        severity: 'info',
        userId: req.user ? req.user._id : null,
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        resource: req.originalUrl,
        action: req.method,
        details: {
          params: req.params,
          query: req.query,
          // We don't log the full body to avoid sensitive data (passwords, etc) 
          // unless specifically needed for forensics
        }
      });
    } catch (error) {
      console.error('Security Logger Error:', error);
    }
  }
  next();
};

module.exports = { securityLogger };
