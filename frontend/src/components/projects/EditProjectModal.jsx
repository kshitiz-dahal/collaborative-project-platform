const EditProjectModal = ({
    formData,
    onChange,
    onSubmit,
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
                className="project-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="modal-header">
                    <div>
                        <span className="modal-eyebrow">
                            PROJECT SETTINGS
                        </span>

                        <h2>Edit Project</h2>

                        <p>
                            Update your project information.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={onSubmit}>
                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}

                    <div className="form-group">
                        <label htmlFor="edit-project-name">
                            Project Name
                            <span className="required-mark">*</span>
                        </label>

                        <input
                            id="edit-project-name"
                            type="text"
                            name="name"
                            placeholder="e.g. Collaborative Platform"
                            value={formData.name}
                            onChange={onChange}
                            required
                            autoFocus
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="edit-project-description">
                            Description
                        </label>

                        <textarea
                            name="description"
                            id="edit-project-description"
                            placeholder="Briefly describe what this project is about..."
                            value={formData.description}
                            onChange={onChange}
                            rows="4"
                        />

                        <span className="form-hint">
                            Update the description to keep your workspace information clear.
                        </span>
                    </div>

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
                            type="submit"
                            disabled={loading}
                            className="primary-button">
                            {loading ? (
                                <>
                                    <span className="button-spinner" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProjectModal;