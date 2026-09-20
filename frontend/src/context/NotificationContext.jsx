import React, {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";
import api from "../api/axios";
import socket from "../socket";

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);

    const unreadCount = notifications.filter(
        (notification) => !notification.isRead
    ).length;

    const fetchNotifications = async () => {
        try {
            setLoading(true);

            const response = await api.get("/notifications");

            setNotifications(response.data.notifications);
        } catch (error) {
            console.error(
                "Failed to fetch notifications:",
                error.response?.data?.message || error.message
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();

        const handleNotificationCreated = (notification) => {

            setNotifications((currentNotifications) => {
                const alreadyExists = currentNotifications.some(
                    (existingNotification) =>
                        existingNotification._id === notification._id
                );

                if (alreadyExists) {
                    return currentNotifications;
                }

                return [notification, ...currentNotifications];
            });
        };

        socket.on(
            "notification-created",
            handleNotificationCreated
        );

        return () => {
            socket.off(
                "notification-created",
                handleNotificationCreated
            );
        };
    }, []);

    const markAsRead = async (notificationId) => {
        try {
            const response = await api.put(
                `/notifications/${notificationId}/read`
            );

            const updatedNotification =
                response.data.notification;

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) =>
                    notification._id === updatedNotification._id
                        ? updatedNotification
                        : notification
                )
            );
        } catch (error) {
            console.error(
                "Failed to mark notification as read:",
                error.response?.data?.message || error.message
            );
        }
    };

    const markAllAsRead = async () => {
        try {
            await api.put("/notifications/read-all");

            setNotifications((currentNotifications) =>
                currentNotifications.map((notification) => ({
                    ...notification,
                    isRead: true,
                }))
            );
        } catch (error) {
            console.error(
                "Failed to mark all notifications as read:",
                error.response?.data?.message || error.message
            );
        }
    };

    const value = {
        notifications,
        unreadCount,
        loading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
        </NotificationContext.Provider>
    );
};

export default NotificationContext;