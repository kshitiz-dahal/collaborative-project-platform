import { useState, useEffect, useRef } from "react";
import { useNotifications } from "../../context/NotificationContext";

const Topbar = () => {

    const notificationRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(event.target)
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const formatNotificationTime = (date) => {
        const diff = Date.now() - new Date(date).getTime();

        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (seconds < 60) return "Just now";
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;

        return new Date(date).toLocaleDateString();
    }   

    const {
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
    } = useNotifications();

    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="topbar">
            <div className="topbar-search">
                <span>⌕</span>

                <input
                    type="text"
                    placeholder="Search projects, tasks, or people..."
                />

                <span className="search-shortcut">
                    ⌘ K
                </span>
            </div>

            <div
                className="notification-wrapper"
                ref={notificationRef}
            >
            <button
                type="button"
                className="topbar-icon-button notification-button"
                onClick={() =>
                    setShowNotifications((current) => !current)
                }
            >
                🔔

                {unreadCount > 0 && (
                    <span className="notification-badge">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="notification-dropdown">
                    <div className="notification-dropdown-header">
                        <div>
                            <h3>Notifications</h3>
                            <span>
                                {unreadCount} unread
                            </span>
                        </div>

                        {unreadCount > 0 && (
                            <button
                                type="button"
                                onClick={markAllAsRead}
                            >
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="notification-empty">
                                <div>🔔</div>
                                <p>No notifications</p>
                            </div>
                        ) : (
                            notifications.slice(0, 10).map(
                                (notification) => (
                                    <div
                                        key={notification._id}
                                        className={`notification-item ${
                                            notification.isRead
                                                ? ""
                                                : "unread"
                                        }`}
                                        onClick={() => {
                                            if (!notification.isRead) {
                                                markAsRead(
                                                    notification._id
                                                );
                                            }
                                        }}
                                    >
                                        <div className="notification-avatar">
                                            {notification.actor?.name
                                                ?.charAt(0)
                                                .toUpperCase() || "?"}
                                        </div>

                                        <div className="notification-content">
                                            <p>
                                                {notification.message}
                                            </p>

                                            <span>
                                                {formatNotificationTime(notification.createdAt)}
                                            </span>
                                        </div>

                                        {!notification.isRead && (
                                            <span className="notification-dot" />
                                        )}
                                    </div>
                                )
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
        </header>
    );
};

export default Topbar;