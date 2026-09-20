const DeleteProjectModal = ({
    projectName,
    onConfirm,
    onClose,
    loading,
    error,
}) => {
    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="project-modal delete-project-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <div>
                        <span className="modal-eyebrow">
                            DANGER ZONE
                        </span>

                        <h2>Delete Project?</h2>

                        <p>
                            This action cannot be undone.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>

                <div className="delete-project-content">
                    <p>
                        Are you sure you want to delete{" "}
                        <strong>{projectName}</strong>?
                    </p>

                    <p>
                        This will permanently delete the project,
                        its tasks, activities, and notificaitions.
                    </p>
                </div>

                {error && (
                    <div className="form-error">
                        {error}
                    </div>
                )}

                <div className="modal-actions">
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
                        className="primary-button"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="button-spinner" />
                                Deleting...
                            </>
                        ) : (
                            "Delete Project"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteProjectModal;