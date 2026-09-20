const {
    createTask,
    getProjectTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../services/task.service");

const create = async (req, res) => {
    try {
        const task = await createTask(
            req.params.projectId,
            req.user.id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Task created successfully",
            task,
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};

const getTasks = async (req, res) => {
    try {
        const tasks = await getProjectTasks(
            req.params.projectId,
            req.user.id
        );
        
        res.status(200).json({
            success: true,
            tasks,
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};

const getById = async (req, res) => {
    try {
        const task = await getTaskById(
            req.params.taskId,
            req.user.id,
        );

        res.status(200).json({
            success: true,
            task,
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
        const task = await updateTask(
            req.params.taskId,
            req.user.id,
            req.body
        );

        res.status(200).json({
            success: true,
            message: "Task updated successfully",
            task,
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
        await deleteTask(
            req.params.taskId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Task deleted successfully",
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
    getTasks,
    getById,
    update,
    remove,
};