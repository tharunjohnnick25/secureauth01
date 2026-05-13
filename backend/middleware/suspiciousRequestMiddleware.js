const { logger } = require('../utils/logger');
const SecurityLog = require('../models/SecurityLog');

/**
 * Middleware to detect suspicious request patterns
 * Detects:
 * 1. SQL Injection attempts
 * 2. XSS attempts
 * 3. Path Traversal attempts
 * 4. Unusual User Agents
 */
const suspiciousRequestDetection = async (req, res, next) => {
  const { query, body, params, url, headers } = req;
  const userAgent = headers['user-agent'] || 'unknown';
  const ip = req.ip;

  // Patterns to check
  const sqlInjectionPattern = /('|--|truncate|delete|insert|drop|update|union|select|sleep|benchmark)/i;
  const xssPattern = /(<script|script>|onerror|onload|javascript:)/i;
  const pathTraversalPattern = /(\.\.\/|\.\.\\)/;

  let isSuspicious = false;
  let reason = '';

  const checkValue = (val, type) => {
    if (typeof val === 'string') {
      if (sqlInjectionPattern.test(val)) {
        isSuspicious = true;
        reason = `SQL Injection attempt in ${type}`;
        return true;
      }
      if (xssPattern.test(val)) {
        isSuspicious = true;
        reason = `XSS attempt in ${type}`;
        return true;
      }
      if (pathTraversalPattern.test(val)) {
        isSuspicious = true;
        reason = `Path Traversal attempt in ${type}`;
        return true;
      }
    } else if (typeof val === 'object' && val !== null) {
      for (const key in val) {
        if (checkValue(val[key], `${type}.${key}`)) return true;
      }
    }
    return false;
  };

  // Check query params, body, and URL
  checkValue(query, 'query');
  checkValue(body, 'body');
  checkValue(params, 'params');
  if (sqlInjectionPattern.test(url) || xssPattern.test(url) || pathTraversalPattern.test(url)) {
    isSuspicious = true;
    reason = 'Suspicious pattern in URL';
  }

  // Check for suspicious user agents (e.g., automated scanners)
  const suspiciousUserAgents = ['sqlmap', 'nmap', 'nikto', 'dirbuster', 'gobuster', 'burpsuite'];
  if (suspiciousUserAgents.some(ua => userAgent.toLowerCase().includes(ua))) {
    isSuspicious = true;
    reason = `Suspicious User-Agent: ${userAgent}`;
  }

  if (isSuspicious) {
    logger.warn(`🛑 Suspicious request detected: ${reason} | IP: ${ip} | URL: ${url}`);
    
    // Log to database
    try {
      await SecurityLog.create({
        event: 'SUSPICIOUS_REQUEST',
        severity: 'high',
        userId: req.user ? req.user._id : null,
        ipAddress: ip,
        userAgent: userAgent,
        resource: url,
        action: req.method,
        details: {
          reason,
          query,
          body: JSON.parse(JSON.stringify(body)), // Clone body
          headers: {
            'user-agent': userAgent,
            'host': headers.host
          }
        }
      });
    } catch (err) {
      logger.error('Error logging suspicious request:', err);
    }

    // Block the request if it's high severity or in production
    // For now, we'll just log and continue, or we can return 403
    return res.status(403).json({
      message: 'Access denied due to suspicious activity.',
      requestId: req.id // If using request IDs
    });
  }

  next();
};

module.exports = { suspiciousRequestDetection };
