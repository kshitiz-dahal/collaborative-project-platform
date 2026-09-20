const TaskCard = ({
    task,
    onEdit,
    onDelete,
}) => {
    const getInitial = () =>
        task.assignee?.name?.charAt(0).toUpperCase() || "?";

    const formatStatus = (status) => {
        if (status === "in-progress") return "In Progress";
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const formatPriority = (priority) =>
        priority.charAt(0).toUpperCase() + priority.slice(1);

    return (
        <div className="task-card">
            <div className="task-card-header">
                <span className="task-type-icon">✓</span>
            </div>

            <h3>{task.title}</h3>

            {task.description && (
                <p className="task-description">
                    {task.description}
                </p>
            )}

            <div className="task-badges">
                <span
                    className={`status-badge status-${task.status}`}
                >
                    {formatStatus(task.status)}
                </span>

                <span
                    className={`priority-badge priority-${task.priority}`}
                >
                    {formatPriority(task.priority)}
                </span>
            </div>

            <div className="task-card-footer">
                <div className="task-assignee">
                    <div className="task-avatar">
                        {getInitial()}
                    </div>

                    <span>
                        {task.assignee?.name || "Unassigned"}
                    </span>
                </div>

                {task.dueDate && (
                    <span className="task-due-date">
                        {new Date(task.dueDate).toLocaleDateString(
                            "en-IN",
                            {
                                day: "numeric",
                                month: "short",
                            }
                        )}
                    </span>
                )}
            </div>

            <div className="task-card-actions">
                <button
                    type="button"
                    onClick={() => onEdit(task)}
                >
                    Edit
                </button>

                <button
                    type="button"
                    onClick={() => onDelete(task)}
                >
                    Delete
                </button>
            </div>
        </div>
    );
};

export default TaskCard;