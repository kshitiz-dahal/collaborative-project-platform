import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const TaskDetailsModal = ({
    task,
    project,
    projectMembers,
    onClose,
    onSave,
    loading,
    error,
    newComment,
    updatedComment, 
    deletedComment,
}) => {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        assignee: "",
        dueDate: "",
    });

    const { user } = useAuth();

    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsError, setCommentsError] = useState("");

    const [commentText, setCommentText] = useState("");
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [commentSubmitError, setCommentSubmitError] = useState("");

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState("");
    const [commentActionLoading, setCommentActionLoading] = useState(false);
    const [commentActionError, setCommentActionError] = useState("");

    useEffect(() => {
        if (!task) return;

        setFormData({
            title: task.title || "",
            description: task.description || "",
            status: task.status || "todo",
            priority: task.priority || "medium",
            assignee: task.assignee?._id || "",
            dueDate: task.dueDate
                ? task.dueDate.split("T")[0]
                : "",
        });
    }, [task]);

    useEffect(() => {
        if (!task) return;

        const fetchComments = async () => {
            setCommentsLoading(true);
            setCommentsError("");

            try {
                const response = await api.get(
                    `/tasks/${task._id}/comments`
                );

                setComments(response.data.comments);
            } catch (error) {
                setCommentsError(
                    error.response?.data?.message ||
                    "Failed to load comments."
                );
            } finally {
                setCommentsLoading(false);
            }
        };

        fetchComments();
    }, [task]);

    useEffect(() => {
        if (!newComment || !task) return;

        if (newComment.task !== task._id) return;

        setComments((prev) => {
            const alreadyExists = prev.some(
                (comment) => comment._id === newComment._id
            );

            if (alreadyExists) {
                return prev;
            }

            return [...prev, newComment];
        });
    }, [newComment, task]);

    useEffect(() => {
        if (!updatedComment || !task) return;

        if (
            updatedComment.task?.toString() !== task._id?.toString()
        ) {
            return;
        }

        setComments((prev) =>
            prev.map((comment) =>
                comment._id === updatedComment._id
                    ? updatedComment
                    : comment
            )
        );
        
    }, [updatedComment, task]);

    useEffect(() => {
        if (!deletedComment || !task) return;

        if (
            deletedComment.taskId?.toString() !==
            task._id?.toString()
        ) {
            return;
        }

        setComments((prev) => {
            const filteredComments = prev.filter(
                (comment) =>
                    comment._id?.toString() !==
                    deletedComment.commentId?.toString()
            );

            return filteredComments;
        });
    }, [deletedComment, task]);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        onSave(task._id, {
            ...formData,
            assignee: formData.assignee || null,
            dueDate: formData.dueDate || null,
        });
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();

        if (!commentText.trim()) return;

        setCommentSubmitting(true);
        setCommentSubmitError("");

        try {
            const response = await api.post(
                `/tasks/${task._id}/comments`,
                {
                    content: commentText.trim(),
                }
            );

            setComments((prev) => [
                ...prev,
                response.data.comment,
            ]);

            setCommentText("");
        } catch (error) {
            setCommentSubmitError(
                error.response?.data?.message ||
                "Failed to add comment."
            );
        } finally {
            setCommentSubmitting(false);
        }
    };

    const handleEditComment = async (commentId) => {
        if (!editingCommentText.trim()) return;

        setCommentActionLoading(true);
        setCommentActionError("");

        try {
            const response = await api.put(
                `/comments/${commentId}`,
                {
                    content: editingCommentText.trim(),
                }
            );

            setComments((prev) =>
                prev.map((comment) =>
                    comment._id === commentId
                        ? response.data.comment
                        : comment
                )
            );

            setEditingCommentId(null);
            setEditingCommentText("");
        } catch (error) {
            setCommentActionError(
                error.response?.data?.message || "Failed to update comment."
            );
        } finally {
            setCommentActionLoading(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this comment?"
        );

        if (!confirmed) return;

        setCommentActionLoading(true);
        setCommentActionError("");

        try {
            await api.delete(
                `/comments/${commentId}`
            );

            setComments((prev) =>
                prev.filter(
                    (comment) => comment._id !== commentId
                )
            );
        } catch (error) {
            setCommentActionError(
                error.response?.data?.message || "Failed to delete comment."
            );
        } finally {
            setCommentActionLoading(false);
        }
    };

    if (!task) return null;

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
                            TASK DETAILS
                        </span>

                        <h2>{task.title}</h2>
                    </div>

                    <button
                        type="button"
                        className="modal-close"
                        onClick={onClose}
                    >
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
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            required
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
                                <option value="todo">
                                    Todo
                                </option>

                                <option value="in-progress">
                                    In Progress
                                </option>

                                <option value="completed">
                                    Completed
                                </option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Priority</label>

                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                            >
                                <option value="low">
                                    Low
                                </option>

                                <option value="medium">
                                    Medium
                                </option>

                                <option value="high">
                                    High
                                </option>
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
                                <option value="">
                                    Unassigned
                                </option>

                                {projectMembers.map((member) => (
                                    <option
                                        key={member._id}
                                        value={member._id}
                                    >
                                        {member.name}
                                    </option>
                                ))}
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
                            {loading
                                ? "Saving..."
                                : "Save Changes"}
                        </button>
                    </div>
                </form>

                <div className="task-comments-section">
                    <div className="task-comments-header">
                        <h3>Comments</h3>

                        <span>
                            {comments.length}
                        </span>
                    </div>

                    {commentsLoading && (
                        <div className="comments-loading">
                            Loading comments...
                        </div>
                    )}

                    {commentsError && (
                        <div className="form-error">
                            {commentsError}
                        </div>
                    )}

                    {!commentsLoading &&
                        !commentsError &&
                        comments.length === 0 && (
                            <div className="comments-empty">
                                No comments yet.
                            </div>
                        )}
                    
                    {!commentsLoading && comments.length > 0 && (
                        <div className="comments-list">
                            {comments.map((comment) => (
                                <div
                                    key={comment._id}
                                    className="comment-item">
                                    <div className="comment-avatar">
                                        {comment.user?.name?.charAt(0)?.toUpperCase()}
                                    </div>

                                    <div className="comment-body">
                                        <div className="comment-meta">
                                            <strong>
                                                {comment.user?.name}
                                            </strong>

                                            <span>
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        {editingCommentId === comment._id ? (
                                            <div className="comment-edit-form">
                                                <textarea
                                                    value={editingCommentText}
                                                    onChange={(event) =>
                                                        setEditingCommentText(
                                                            event.target.value
                                                        )
                                                    }
                                                    rows="3"
                                                    disabled={commentActionLoading}
                                                />

                                                <div className="comment-edit-actions">
                                                    <button
                                                        type="button"
                                                        className="secondary-button"
                                                        onClick={() => {
                                                            setEditingCommentId(null);
                                                            setEditingCommentText("");
                                                        }}
                                                        disabled={commentActionLoading}
                                                    >
                                                        Cancel
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="primary-button"
                                                        onClick={() =>
                                                            handleEditComment(
                                                                comment._id
                                                            )
                                                        }
                                                        disabled={
                                                            commentActionLoading ||
                                                            !editingCommentText.trim()
                                                        }
                                                    >
                                                        Save
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <p>{comment.comment}</p>

                                                {(comment.user?._id === user?.id ||
                                                    project?.owner?._id === user?.id) &&(
                                                    <div className="comment-actions">
                                                        {comment.user?._id === user?.id && (
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setEditingCommentId(
                                                                        comment._id
                                                                    );
                                                                    setEditingCommentText(
                                                                        comment.comment
                                                                    );
                                                                }}
                                                            >
                                                                Edit
                                                            </button>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                handleDeleteComment(
                                                                    comment._id
                                                                )
                                                            }
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <form
                        className="comment-composer"
                        onSubmit={handleCommentSubmit}
                    >
                        {commentSubmitError && (
                            <div className="form-error">
                                {commentSubmitError}
                            </div>
                        )}

                        <textarea
                            value={commentText}
                            onChange={(event) => setCommentText(event.target.value)}
                            placeholder="Write a comment..."
                            rows={3}
                            disabled={commentSubmitting}
                        />

                        <div className="comment-composer-footer">
                            <span>
                                Press the button to post your comment
                            </span>

                            <button
                                type="submit"
                                className="primary-button"
                                disabled={commentSubmitting || !commentText.trim()}
                            >
                                {commentSubmitting ? "Posting..." : "Comment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailsModal;