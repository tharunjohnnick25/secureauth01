const express = require('express');
const router = express.Router();
const { getUsers, blockUser, getThreats, getStats, getSecurityLogs, generateThreatReport } = require('../controllers/admin.controller');
const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);
router.use(adminMiddleware);

router.get('/users', getUsers);
router.post('/block-user', blockUser);
router.get('/threats', getThreats);
router.get('/stats', getStats);
router.get('/logs', getSecurityLogs);
router.get('/report', generateThreatReport);

module.exports = router;
