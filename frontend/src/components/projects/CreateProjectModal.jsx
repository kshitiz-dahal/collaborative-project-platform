const CreateProjectModal = ({
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
                            NEW WORKSPACE
                        </span>

                        <h2>Create New Project</h2>

                        <p>
                            Create a workspace for your team.
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
                        <label htmlFor="project-name">
                            Project Name
                            <span className="required-mark">*</span>
                        </label>

                        <input
                            id="project-name"
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
                        <label htmlFor="project-description">
                            Description
                        </label>

                        <textarea
                            id="project-description"
                            name="description"
                            placeholder="Briefly describe what this project is about..."
                            value={formData.description}
                            onChange={onChange}
                            rows="4"
                        />

                        <span className="form-hint">
                            You can update the project description later.
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
                            className="primary-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="button-spinner" />
                                    Creating...
                                </>
                            ) : (
                                "Create Project"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateProjectModal;