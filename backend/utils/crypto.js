const crypto = require('crypto');

/**
 * Generate a cryptographically secure 6-digit OTP
 */
const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Generate a secure random string for tokens
 */
const generateRandomString = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

module.exports = {
  generateOTP,
  generateRandomString
};
