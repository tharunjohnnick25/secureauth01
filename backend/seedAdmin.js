const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/secureauth').then(async () => {
  console.log('Connected to MongoDB');
  
  const adminEmail = 'admin@secureauthai.com';
  
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      email: adminEmail,
      password: 'SecureAuth@123',
      firstName: 'System',
      lastName: 'Administrator',
      role: 'admin',
      isBlocked: false,
      mfaEnabled: false
    });
    console.log('Default admin user created successfully.');
  } else {
    console.log('Admin user already exists. Overwriting password to default.');
    existingAdmin.password = 'SecureAuth@123';
    existingAdmin.role = 'admin';
    await existingAdmin.save();
    console.log('Admin user updated.');
  }
  
  mongoose.connection.close();
}).catch(err => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1);
});
