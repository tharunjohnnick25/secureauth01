const { logger } = require('../utils/logger');

/**
 * Middleware to validate request body/query/params using Joi schema
 * @param {Object} schema - Joi schema object
 * @param {String} source - Request object property to validate (body, query, params)
 */
const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // Include all errors
      stripUnknown: true, // Remove unknown fields
    });

    if (error) {
      const errorMessage = error.details
        .map((detail) => detail.message)
        .join(', ');
      
      logger.warn(`Validation error on ${req.originalUrl}: ${errorMessage}`);
      
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.details.map((detail) => ({
          field: detail.path[0],
          message: detail.message.replace(/"/g, ''),
        })),
      });
    }

    // Replace request data with validated (and stripped) value
    req[source] = value;
    next();
  };
};

module.exports = { validate };
