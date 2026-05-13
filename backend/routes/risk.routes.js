const express = require('express');
const router = express.Router();
const { getRiskScore, getThreatAnalysis, getSecurityReport } = require('../controllers/risk.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/risk-score', getRiskScore);
router.get('/threat-analysis', getThreatAnalysis);
router.get('/security-report', getSecurityReport);

module.exports = router;
