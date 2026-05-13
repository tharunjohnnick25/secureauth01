const nodemailer = require('nodemailer');
const { logger } = require('../utils/logger');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`📧 Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('❌ Email send failed:', error);
    throw new Error('Email could not be sent');
  }
};

const sendOTPEmail = async (email, otp) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #00f0ff;">SecureAuth AI Verification</h2>
      <p>Your one-time password (OTP) for authentication is:</p>
      <div style="background: #f4f4f4; padding: 15px; font-size: 24px; font-weight: bold; letter-spacing: 5px; text-align: center; border-radius: 8px;">
        ${otp}
      </div>
      <p>This code will expire in 10 minutes. If you did not request this, please secure your account immediately.</p>
    </div>
  `;
  return sendEmail({ to: email, subject: 'Your SecureAuth AI OTP', html });
};

const sendSecurityAlert = async (email, details) => {
  const html = `
    <div style="font-family: sans-serif; padding: 20px; color: #333;">
      <h2 style="color: #ff003c;">⚠️ Security Alert</h2>
      <p>We detected a suspicious login attempt on your account.</p>
      <ul>
        <li><strong>Time:</strong> ${new Date().toLocaleString()}</li>
        <li><strong>Location:</strong> ${details.location || 'Unknown'}</li>
        <li><strong>Device:</strong> ${details.device || 'Unknown'}</li>
        <li><strong>Risk Level:</strong> ${details.riskLevel || 'High'}</li>
      </ul>
      <p>If this was not you, please block your account and change your password immediately.</p>
    </div>
  `;
  return sendEmail({ to: email, subject: 'Security Alert: Suspicious Activity Detected', html });
};

module.exports = {
  sendEmail,
  sendOTPEmail,
  sendSecurityAlert
};
