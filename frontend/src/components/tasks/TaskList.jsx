import TaskCard from "./TaskCard";

const TaskList = ({
    tasks,
    onEdit,
    onDelete,
}) => {
    return (
        <div className="task-list">
            <div className="task-list-header">
                <div>Task</div>
                <div>Status</div>
                <div>Priority</div>
                <div>Assignee</div>
                <div>Due Date</div>
                <div>Actions</div>
            </div>

            {tasks.map((task) => (
                <div
                    className="task-list-row"
                    key={task._id}
                >
                    <div className="task-list-title">
                        <span className="task-type-icon">
                            ✓
                        </span>

                        <div>
                            <strong>{task.title}</strong>

                            {task.description && (
                                <p>{task.description}</p>
                            )}
                        </div>
                    </div>

                    <div>
                        <span
                            className={`status-badge status-${task.status}`}
                        >
                            {task.status === "in-progress"
                                ? "In Progress"
                                : task.status}
                        </span>
                    </div>

                    <div>
                        <span
                            className={`priority-badge priority-${task.priority}`}
                        >
                            {task.priority}
                        </span>
                    </div>

                    <div className="task-list-assignee">
                        <div className="task-avatar">
                            {task.assignee?.name
                                ?.charAt(0)
                                .toUpperCase() || "?"}
                        </div>

                        <span>
                            {task.assignee?.name ||
                                "Unassigned"}
                        </span>
                    </div>

                    <div className="task-list-due-date">
                        {task.dueDate
                            ? new Date(
                                task.dueDate
                            ).toLocaleDateString(
                                "en-IN",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                }
                            )
                            : "—"}
                    </div>

                    <div className="task-list-actions">
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
            ))}
        </div>
    );
};

export default TaskList;