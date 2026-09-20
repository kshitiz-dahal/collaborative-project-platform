const TaskToolbar = ({
    search,
    onSearchChange,
    status,
    onStatusChange,
    priority,
    onPriorityChange,
    assignee,
    onAssigneeChange,
    projectMembers,
    onClearFilters,
}) => {
    const hasActiveFilters =
        search.trim() !== "" ||
        status !== "all" ||
        priority !== "all" ||
        assignee !== "all";

    return (
        <div className="task-toolbar">
            <div className="task-search">
                <span className="task-search-icon">⌕</span>

                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(event) =>
                        onSearchChange(event.target.value)
                    }
                />
            </div>

            <select
                value={status}
                onChange={(event) =>
                    onStatusChange(event.target.value)
                }
            >
                <option value="all">All Status</option>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
            </select>

            <select
                value={priority}
                onChange={(event) =>
                    onPriorityChange(event.target.value)
                }
            >
                <option value="all">All Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
            </select>

            <select
                value={assignee}
                onChange={(event) =>
                    onAssigneeChange(event.target.value)
                }
            >
                <option value="all">All Assignees</option>
                <option value="unassigned">Unassigned</option>

                {projectMembers.map((member) => (
                    <option
                        key={member._id}
                        value={member._id}
                    >
                        {member.name}
                    </option>
                ))}
            </select>

            <button
                type="button"
                className={`clear-filters-button ${
                    hasActiveFilters ? "clear-filters-active" : ""
                }`}
                onClick={onClearFilters}
                disabled={!hasActiveFilters}
            >
                Clear
            </button>
        </div>
    );
};

export default TaskToolbar;