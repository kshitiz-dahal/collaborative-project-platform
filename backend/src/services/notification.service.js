const Notification = require("../models/Notification");

const createNotification = async ({
    recipientId,
    projectId,
    actorId,
    type,
    taskId = null,
    message,
}) => {
    const notification = await Notification.create({
        recipient: recipientId,
        project: projectId,
        actor: actorId,
        type,
        task: taskId,
        message,
    });

    const populatedNotification =
        await Notification.findById(notification._id)
            .populate("recipient", "name email")
            .populate("actor", "name email")
            .populate("project", "name")
            .populate("task", "title");

    return populatedNotification;
};

const getUserNotifications = async (userId) => {
    const notifications = await Notification.find({
        recipient: userId,
    })
        .populate("actor", "name email")
        .populate("project", "name")
        .populate("task", "title")
        .sort({ createdAt: -1 });

    return notifications;
};

const markNotificationAsRead = async (
    notificationId,
    userId
) => {
    const notification = await Notification.findOne({
        _id: notificationId,
        recipient: userId,
    });

    if (!notification) {
        const error = new Error(
            "Notification not found"
        );
        error.statusCode = 404;
        throw error;
    }

    notification.isRead = true;

    await notification.save();

    return notification;
};

const markAllNotificationsAsRead = async (userId) => {
    await Notification.updateMany(
        {
            recipient: userId,
            isRead: false,
        },
        {
            $set: {
                isRead: true,
            },
        }
    );

    return true;
};

module.exports = {
    createNotification,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
};