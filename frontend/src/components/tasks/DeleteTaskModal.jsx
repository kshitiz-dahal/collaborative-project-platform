const DeleteTaskModal = ({
    task,
    onClose,
    onConfirm,
    loading,
}) => {
    if (!task) return null;

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="delete-task-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="delete-modal-icon">
                    !
                </div>

                <div className="delete-modal-content">
                    <h2>Delete Task?</h2>

                    <p>
                        Are you sure you want to delete{" "}
                        <strong>"{task.title}"</strong>
                    </p>

                    <span>
                        This action cannot be undone.
                    </span>
                </div>

                <div className="delete-modal-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        className="delete-confirm-button"
                        onClick={() => onConfirm(task._id)}
                        disabled={loading}
                    >
                        {loading ? "Deleting..." : "Delete Task"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteTaskModal;