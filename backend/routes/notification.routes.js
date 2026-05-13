const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, deleteNotification } = require('../controllers/notification.controller');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.get('/', getNotifications);
router.patch('/:notificationId', markAsRead);
router.delete('/:notificationId', deleteNotification);

module.exports = router;
