const {
    createComment,
    getTaskComments,
    updateComment,
    deleteComment,
} = require("../services/comment.service");

const create = async (req, res) => {
    try {
        const comment = await createComment(
            req.params.taskId,
            req.user.id,
            req.body.content
        );

        res.status(201).json({
            success: true,
            message: "Comment created successfully",
            comment,
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};

const getByTask = async (req, res) => {
    try {
        const comments = await getTaskComments(
            req.params.taskId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            comments,
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};

const update = async (req, res) => {
    try {
        const comment = await updateComment(
            req.params.commentId,
            req.user.id,
            req.body.content
        );

        res.status(200).json({
            success: true,
            message: "Comment updated successfully",
            comment,
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};

const remove = async (req, res) => {
    try {
        const result = await deleteComment(
            req.params.commentId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Comment deleted successfully",
            ...result,
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    create,
    getByTask,
    update,
    remove,
};