const express = require('express');
const admin = require('firebase-admin');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const router = express.Router();

// 1. Initialize Firebase Admin SDK
// Service Account credentials should be stored in environment variables securely
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

// 2. Simple MongoDB User Schema Mapping
const UserSchema = new mongoose.Schema({
  firebaseUid: { type: String, unique: true, required: true },
  email: { type: String, required: true },
  name: { type: String },
  avatarUrl: { type: String },
  role: { type: String, default: 'employee' },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

// 3. Post route to verify Firebase ID tokens securely
router.post('/api/auth/google', async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ status: 'error', message: 'Token is required' });
  }

  try {
    // A. Verify Firebase ID Token via Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    // B. Find or create user in MongoDB Database
    let user = await User.findOne({ firebaseUid: uid });
    if (!user) {
      user = new User({
        firebaseUid: uid,
        email: email,
        name: name || email.split('@')[0],
        avatarUrl: picture || '',
        role: 'employee'
      });
      await user.save();
    }

    // C. Generate persistent JWT Session token signed by backend private key
    const jwtToken = jwt.sign(
      {
        userId: user._id,
        firebaseUid: uid,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || 'secureauth_super_secret_jwt_key',
      { expiresIn: '7d' } // Session valid for 7 days
    );

    return res.status(200).json({
      status: 'success',
      message: 'Token verified successfully',
      jwtToken,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Firebase Admin SDK verification error:', error);
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized: Invalid Firebase ID token provided'
    });
  }
});

// 4. Custom JWT Protected Route Middleware for secure APIs
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

    jwt.verify(token, process.env.JWT_SECRET || 'secureauth_super_secret_jwt_key', (err, user) => {
      if (err) {
        return res.status(403).json({ status: 'error', message: 'Forbidden: Invalid Session' });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ status: 'error', message: 'Unauthorized: Missing Authorization Header' });
  }
};

module.exports = { router, authenticateJWT };
