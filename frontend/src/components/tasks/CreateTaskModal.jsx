import { useState, useEffect } from "react";

const CreateTaskModal = ({
    projectMembers,
    onClose,
    onSave,
    loading,
    error,
    initialStatus = "todo",
}) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: initialStatus,
        priority: "medium",
        assignee: "",
        dueDate: "",
    });

    useEffect(() => {
        setFormData({
            title: "",
            description: "",
            status: initialStatus,
            priority: "medium",
            assignee: "",
            dueDate: "",
        });
    }, [initialStatus]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        onSave({
            ...formData,
            assignee: formData.assignee || null,
            dueDate: formData.dueDate || null,
        });
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="task-details-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="task-modal-header">
                    <div>
                        <span className="task-modal-label">
                            NEW TASK
                        </span>

                        <h2>Create Task</h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="modal-close">
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Task Title</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter task title"
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label>Task Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe what needs to be done..."
                            rows="4"
                        />
                    </div>

                    <div className="task-form-grid">
                        <div className="form-group">
                            <label>Status</label>

                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="todo">Todo</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Priority</label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>

                    <div className="task-form-grid">
                        <div className="form-group">
                            <label>Assignee</label>

                            <select
                                name="assignee"
                                value={formData.assignee}
                                onChange={handleChange}
                            >
                                <option value="">Unassigned</option>

                                {projectMembers.map(
                                    (member) => (
                                        <option
                                            key={member._id}
                                            value={member._id}
                                        >
                                            {member.name}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Due Date</label>

                            <input
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="task-modal-footer">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading ? "Creating..." : "Create Task"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default CreateTaskModal;