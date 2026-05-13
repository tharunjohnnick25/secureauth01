const { logger } = require('./logger');

/**
 * Validates that all required environment variables are present
 */
const validateEnv = () => {
  const requiredEnvVars = [
    'NODE_ENV',
    'PORT',
    'MONGO_URI',
    'JWT_SECRET',
    'JWT_EXPIRE',
    'FRONTEND_URL',
  ];

  const missingEnvVars = requiredEnvVars.filter(
    (envVar) => !process.env[envVar]
  );

  if (missingEnvVars.length > 0) {
    const errorMsg = `❌ Missing required environment variables: ${missingEnvVars.join(', ')}`;
    logger.error(errorMsg);
    
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMsg);
    }
  } else {
    logger.info('✅ Environment variables validated');
  }
};

module.exports = { validateEnv };
