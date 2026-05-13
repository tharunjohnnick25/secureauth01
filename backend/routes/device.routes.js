const express = require('express');
const router = express.Router();
const { getDevices, verifyDevice, removeDevice, toggleTrust } = require('../controllers/device.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getDevices);
router.post('/verify', verifyDevice);
router.patch('/:deviceId/toggle-trust', toggleTrust);
router.delete('/:deviceId', removeDevice);

module.exports = router;
