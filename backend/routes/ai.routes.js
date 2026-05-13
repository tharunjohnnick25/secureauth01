const express = require('express');
const router = express.Router();
const { getAssistantResponse, getRecommendations } = require('../controllers/ai.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

// All AI routes require authentication
router.use(authMiddleware);

router.post('/assistant', getAssistantResponse);
router.get('/recommendations', getRecommendations);

module.exports = router;
