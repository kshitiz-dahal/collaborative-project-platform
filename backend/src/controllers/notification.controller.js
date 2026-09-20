const {
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
} = require("../services/notification.service");

const getNotifications = async (req, res, next) => {
    try {
        const notifications = await getUserNotifications(
            req.user.id
        );

        res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        next(error);
    }
};

const markAsRead = async (req, res, next) => {
    try {
        const { notificationId } = req.params;

        const notification =
            await markNotificationAsRead(
                notificationId,
                req.user.id
            );

        res.status(200).json({
            success: true,
            notification,
        });
    } catch (error) {
        next(error);
    }
};

const markAllAsRead = async (req, res, next) => {
    try {
        await markAllNotificationsAsRead(
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "All notifications marked as read",
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getNotifications,
    markAsRead,
    markAllAsRead,
};