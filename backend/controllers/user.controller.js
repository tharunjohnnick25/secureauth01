const User = require('../models/User');

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { firstName, lastName, mfaEnabled } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, mfaEnabled },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

const saveTypingPattern = async (req, res, next) => {
  try {
    const { metrics, wpm, errorRate } = req.body;
    const userId = req.user._id;
    const TypingBehavior = require('../models/TypingBehavior');
    const aiService = require('../services/ai.service');

    let profile = await TypingBehavior.findOne({ userId });
    if (!profile) {
      profile = new TypingBehavior({ userId, samples: [] });
    }

    // Keep only last 50 samples for moving average
    if (profile.samples.length >= 50) {
      profile.samples.shift();
    }

    profile.samples.push({ metrics, wpm, errorRate });
    await profile.save();

    // Update baseline AI analysis
    const newBaseline = await aiService.updateBaseline(profile);
    
    // Link to user if not linked
    if (!req.user.typingProfile) {
      await User.findByIdAndUpdate(userId, { typingProfile: profile._id });
    }

    res.json({ success: true, message: 'Typing pattern learned', baseline: newBaseline });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  saveTypingPattern
};
