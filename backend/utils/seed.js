require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const { logger } = require('./logger');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    logger.info('Connected to MongoDB for seeding...');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@secureauth.io';
    const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecure123!';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      logger.info('Admin user already exists. Skipping...');
    } else {
      await User.create({
        email: adminEmail,
        password: adminPassword,
        firstName: 'System',
        lastName: 'Administrator',
        role: 'admin'
      });
      logger.info('✅ Admin user created successfully');
    }

    // Add some dummy data if needed...

    mongoose.connection.close();
    logger.info('Seeding complete.');
  } catch (error) {
    logger.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAdmin();
