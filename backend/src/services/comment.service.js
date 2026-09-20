const Comment = require("../models/Comment");
const Task = require("../models/Task");
const Project = require("../models/Project");

const { getIO } = require("../socketManager");
const { createActivity } = require("./activity.service");

const { createNotification } = require("./notification.service");

const createComment = async (taskId, userId, content) => {
    const task = await Task.findById(taskId);

    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    const project = await Project.findById(task.project);

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    const isMember = project.members.some(
        (memberId) => memberId.toString() === userId.toString()
    );

    if (!isMember) {
        const error = new Error("You are not a member of this project");
        error.statusCode = 403;
        throw error;
    }

    if (!content || !content.trim()) {
        const error = new Error("Comment content is required");
        error.statusCode = 400;
        throw error;
    }

    const comment = await Comment.create({
        task: taskId,
        project: task.project,
        user: userId,
        comment: content.trim(),
    });

    const populatedComment = await Comment.findById(comment._id)
        .populate("user", "name email");
    
    const activity = await createActivity({
        projectId: task.project,
        userId,
        type: "comment-created",
        message: `${populatedComment.user.name} commented on a task`,
    });

    let notification = null;

    if (
        task.assignee &&
        task.assignee.toString() !== userId.toString()
    ) {
        notification = await createNotification({
            recipientId: task.assignee,
            projectId: task.project,
            actorId: userId,
            type: "comment-created",
            taskId: task._id,
            message: `${populatedComment.user.name} commented on your task "${task.title}"`,
        });
    }

    const io = getIO();

    io.to(`project:${task.project.toString()}`).emit(
        "comment-created",
        populatedComment
    );

    io.to(`project:${task.project.toString()}`).emit(
        "activity-created",
        activity
    );

    if (notification) {
        io.to(`user:${task.assignee.toString()}`).emit(
            "notification-created",
            notification
        );
    }

    return populatedComment;
};

const getTaskComments = async (taskId, userId) => {
    const task = await Task.findById(taskId);

    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    const project = await Project.findById(task.project);

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    const isMember = project.members.some(
        (memberId) => memberId.toString() === userId.toString()
    );

    if (!isMember) {
        const error = new Error("You are not a member of this project");
        error.statusCode = 403;
        throw error;
    }

    return await Comment.find({
        task: taskId,
    })
        .populate("user", "name email")
        .sort({ createdAt: 1 });
};

const updateComment = async (commentId, userId, content) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
        const error = new Error("Comment not found");
        error.statusCode = 404;
        throw error;
    }

    // Only the comment author can edit it
    if (comment.user.toString() !== userId.toString()) {
        const error = new Error(
            "You can only edit your own comments"
        );
        error.statusCode = 403;
        throw error;
    }

    if (!content || !content.trim()) {
        const error = new Error("Comment content is required");
        error.statusCode = 400;
        throw error;
    }

    comment.comment = content.trim();

    await comment.save();

    const updatedComment = await Comment.findById(comment._id)
        .populate("user", "name email");
    
    const io = getIO();

    io.to(`project:${comment.project.toString()}`).emit(
        "comment-updated",
        updatedComment
    );

    return updatedComment;
};

const deleteComment = async (commentId, userId) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
        const error = new Error("Comment not found");
        error.statusCode = 404;
        throw error;
    }

    const project = await Project.findById(comment.project);

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    const isOwner = project.owner.toString() === userId.toString();

    const isAuthor = comment.user.toString() === userId.toString();

    if (!isAuthor && !isOwner) {
        const error = new Error(
            "You are not allowed to delete this comment"
        );
        error.statusCode = 403;
        throw error;
    }

    const projectId = comment.project.toString();
    const commentIdToDelete = comment._id.toString();

    await Comment.findByIdAndDelete(commentId);

    const io = getIO();

    io.to(`project:${projectId}`).emit(
        "comment-deleted",
        {
            commentId: commentIdToDelete,
            taskId: comment.task.toString(),
        }
    );

    return {
        commentId: commentIdToDelete,
    };
};

module.exports = {
    createComment,
    getTaskComments,
    updateComment,
    deleteComment,
};