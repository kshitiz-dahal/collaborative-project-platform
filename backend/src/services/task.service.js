const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/User");
const { getIO } = require("../socketManager");
const { createActivity } = require("./activity.service");
const { createNotification } = require("./notification.service");

const createTask = async (projectId, userId, data) => {
    const project = await Project.findOne({
        _id: projectId,
    });

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

    if (data.assignee) {
        const isAssigneeMember = project.members.some(
            (memberId) => memberId.toString() === data.assignee.toString()
        );

        if (!isAssigneeMember) {
            const error = new Error("Assignee must be a member of this project");
            error.statusCode = 400;
            throw error;
        }
    }

    const task = await Task.create({
        title: data.title,
        description: data.description,
        project: projectId,
        createdBy: userId,
        assignee: data.assignee || null,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate || null,
    });

    const populatedTask = await Task.findById(task._id)
        .populate("createdBy", "name email")
        .populate("assignee", "name email");
    
    let notification = null;

    if (
        populatedTask.assignee &&
        populatedTask.assignee._id.toString() !== userId.toString()
    ) {
        const actingUser = populatedTask.createdBy;

        notification = await createNotification({
            recipientId: populatedTask.assignee._id,
            projectId,
            actorId: userId,
            type: "task-assigned",
            taskId: task._id,
            message: `${actingUser.name} assigned you "${populatedTask.title}"`,
        });
    }
    
    const activity = await createActivity({
        projectId,
        userId,
        type: "task-created",
        taskId: task._id,
        message: `${populatedTask.createdBy.name} created task "${populatedTask.title}"`,
    });

    const io = getIO();

    io.to(`project:${projectId}`).emit(
        "task-created",
        populatedTask
    );

    io.to(`project:${projectId}`).emit(
        "activity-created",
        activity
    );

    if (notification) {
        io.to(`user:${notification.recipient._id.toString()}`).emit(
            "notification-created",
            notification
        );
    }

    return populatedTask;
};

const getProjectTasks = async (projectId, userId) => {
    const project = await Project.findOne({
        _id: projectId,
    });

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

    const tasks = await Task.find({
        project: projectId,
    })
        .populate("createdBy", "name email")
        .populate("assignee", "name email")
        .sort({ createdAt: -1 });
    
    return tasks;
};

const getTaskById = async (taskId, userId) => {
    const task = await Task.findOne({
        _id: taskId,
    })
        .populate("createdBy", "name email")
        .populate("assignee", "name email");
    
    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    const project = await Project.findOne({
        _id: task.project,
    });

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

    return task;
};

const updateTask = async (taskId, userId, updates) => {
    const task = await Task.findOne({
        _id: taskId,
    });

    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    const project = await Project.findOne({
        _id: task.project,
    });

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

    const previousAssignee = task.assignee
        ? task.assignee.toString()
        : null;

    if (updates.assignee !== undefined) {
        if (updates.assignee === null) {
            task.assignee = null;
        } else {
            const isAssigneeMember = project.members.some(
                (memberId) => memberId.toString() === updates.assignee.toString()
            );

            if (!isAssigneeMember) {
                const error = new Error("Assignee must be a member of this project");
                error.statusCode = 400;
                throw error;
            }

            task.assignee = updates.assignee;
        }
    }

    if (updates.title !== undefined) {
        task.title = updates.title;
    }

    if (updates.description !== undefined) {
        task.description = updates.description;
    }

    if (updates.status !== undefined) {
        task.status = updates.status;
    }

    if (updates.priority !== undefined) {
        task.priority = updates.priority;
    }

    if (updates.dueDate !== undefined) {
        task.dueDate = updates.dueDate;
    }

    await task.save();

    const updatedTask = await Task.findOne({
        _id: taskId,
    })
        .populate("createdBy", "name email")
        .populate("assignee", "name email");
    
    const actingUser = await User.findById(userId).select(
        "name email"
    );
    
    let notification = null;

    const newAssignee = task.assignee
        ? task.assignee.toString()
        : null;

    if (
        newAssignee &&
        newAssignee !== previousAssignee &&
        newAssignee !== userId.toString()
    ) {
        notification = await createNotification({
            recipientId: newAssignee,
            projectId: task.project,
            actorId: userId,
            type: "task-assigned",
            taskId: task._id,
            message: `${actingUser.name} assigned you "${updatedTask.title}"`,
        });
    }
    
    const activity = await createActivity({
        projectId: task.project,
        userId,
        type: "task-updated",
        taskId: task._id,
        message: `${actingUser.name} updated task "${updatedTask.title}"`,
    });
    
    const io = getIO();

    io.to(`project:${task.project.toString()}`).emit(
        "task-updated",
        updatedTask
    );

    io.to(`project:${task.project.toString()}`).emit(
        "activity-created",
        activity
    );

    if (notification) {
        io.to(`user:${notification.recipient._id.toString()}`).emit(
            "notification-created",
            notification
        );
    }

    return updatedTask;
};

const deleteTask = async (taskId, userId) => {
    const task = await Task.findOne({
        _id: taskId,
    });

    if (!task) {
        const error = new Error("Task not found");
        error.statusCode = 404;
        throw error;
    }

    const project = await Project.findOne({
        _id: task.project,
    });

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

    const isProjectOwner = project.owner.toString() === userId.toString();

    const isTaskCreator = task.createdBy.toString() === userId.toString();

    if (!isProjectOwner && !isTaskCreator) {
        const error = new Error("You are not allowed to delete this task");
        error.statusCode = 403;
        throw error;
    }

    const projectId = task.project.toString();

    const actingUser = await User.findById(userId).select(
        "name email"
    );

    const activity = await createActivity({
        projectId,
        userId,
        type: "task-deleted",
        taskId: task._id,
        message: `${actingUser.name} deleted task "${task.title}"`
    });

    await Task.deleteOne({
        _id: taskId,
    });

    const io = getIO();

    io.to(`project:${projectId}`).emit(
        "task-deleted",
        {
            taskId: taskId.toString(),
            projectId,
        }
    );

    io.to(`project:${projectId}`).emit(
        "activity-created",
        activity
    );

    return true;
};

module.exports = {
    createTask,
    getProjectTasks,
    getTaskById,
    updateTask,
    deleteTask,
};