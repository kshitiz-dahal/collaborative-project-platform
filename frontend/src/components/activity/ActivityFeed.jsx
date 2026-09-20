const ActivityFeed = ({
    activities,
    loading,
}) => {
    const formatRelativeTime = (date) => {
        const seconds = Math.floor(
            (Date.now() - new Date(date).getTime()) / 1000
        );

        if (seconds < 60) {
            return "Just now";
        }

        const minutes = Math.floor(seconds / 60);

        if (minutes < 60) {
            return `${minutes}m ago`;
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours}h ago`;
        }

        const days = Math.floor(hours / 24);

        if (days < 7) {
            return `${days}d ago`;
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    if (loading) {
        return (
            <div className="activity-card">
                <div className="activity-loading">
                    <div className="activity-loading-dot" />
                    <span>Loading activity...</span>
                </div>
            </div>
        );
    }

    if (activities.length === 0) {
        return (
            <div className="activity-card">
                <div className="activity-empty">
                    <span className="activity-empty-icon">
                        ◷
                    </span>

                    <h3>No activity yet</h3>

                    <p>
                        Project activity will appear here.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="activity-card">
            <div className="activity-header">
                <div>
                    <h2>Activity</h2>

                    <p>
                        Recent activity in this project
                    </p>
                </div>

                <span className="activity-count">
                    {activities.length}
                </span>
            </div>

            <div className="activity-list">
                {activities.map((activity) => (
                    <div
                        className="activity-item"
                        key={activity._id}
                    >
                        <div className="activity-avatar">
                            {activity.user?.name
                                ?.charAt(0)
                                .toUpperCase() || "?"}
                        </div>

                        <div className="activity-content">
                            <p className="activity-message">
                                {activity.message}
                            </p>

                            <span className="activity-time">
                                {formatRelativeTime(
                                    activity.createdAt
                                )}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityFeed;