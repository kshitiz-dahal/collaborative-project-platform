const express = require("express");

const {
    getNotifications,
    markAsRead,
    markAllAsRead,
} = require("../controllers/notification.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
    "/notifications",
    authenticate,
    getNotifications
);

router.put(
    "/notifications/:notificationId/read",
    authenticate,
    markAsRead
);

router.put(
    "/notifications/read-all",
    authenticate,
    markAllAsRead
);

module.exports = router;