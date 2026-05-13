const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, saveTypingPattern } = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { updateProfileSchema } = require('../utils/validationSchemas');

router.use(authMiddleware);

router.get('/profile', getProfile);
router.put('/update-profile', validate(updateProfileSchema), updateProfile);
router.post('/biometrics', saveTypingPattern);

module.exports = router;
