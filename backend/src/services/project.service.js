const Project = require("../models/Project");
const User = require("../models/User");
const Task = require("../models/Task");
const Activity = require("../models/Activity");
const Notification = require("../models/Notification");
const Comment = require("../models/Comment");
const { getIO } = require("../socketManager");
const { createActivity } = require("./activity.service");
const { createNotification } = require("./notification.service");

const createProject = async ({ name, description, userId }) => {
    const project = await Project.create({
        name,
        description,
        owner: userId,
        members: [userId],
    });

    return project;
};

const getUserProjects = async (userId) => {
    const projects = await Project.find({
        members: userId,
    })
        .populate("owner", "name email")
        .populate("members", "name email");

    const projectsWithStats = await Promise.all(
        projects.map(async (project) => {
            const totalTasks = await Task.countDocuments({
                project: project._id,
            });

            const completedTasks = await Task.countDocuments({
                project: project._id,
                status: "completed",
            });

            const progress =
                totalTasks > 0
                    ? Math.round(
                          (completedTasks / totalTasks) * 100
                      )
                    : 0;

            return {
                ...project.toObject(),
                totalTasks,
                completedTasks,
                progress,
            };
        })
    );

    return projectsWithStats;
};

const getProjectById = async (projectId, userId) => {
    const project = await Project.findById(projectId)
        .populate("owner", "name email")
        .populate("members", "name email");
    
    if (!project) {
        throw new Error("Project not found");
    }

    const isMember = project.members.some(
        (member) => member._id.toString() === userId.toString()
    );

    if (!isMember) {
        const error = new Error("You are not a member of this project");
        error.statusCode = 403;
        throw error;
    }

    const totalTasks = await Task.countDocuments({
        project: project._id,
    });

    const completedTasks = await Task.countDocuments({
        project: project._id,
        status: "completed",
    });

    const progress = totalTasks > 0 ? Math.round(
        (completedTasks / totalTasks) * 100)
        : 0;

    return {
        ...project.toObject(),
        totalTasks,
        completedTasks,
        progress,
    };
};

const updateProject = async (projectId, userId, updates) => {
    const project = await Project.findOne({
        _id: projectId,
    });

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    if (project.owner.toString() !== userId.toString()) {
        const error = new Error("Only the project owner can update this project");
        error.statusCode = 403;
        throw error;
    }

    if (updates.name !== undefined) {
        project.name = updates.name;
    }

    if (updates.description !== undefined) {
        project.description = updates.description;
    }

    await project.save();

    const updatedProject = await Project.findOne({
        _id: projectId,
    })
        .populate("owner", "name email")
        .populate("members", "name email");

    const activity = await createActivity({
        projectId,
        userId,
        type: "project-updated",
        message: `${updatedProject.owner.name} updated the project`,
    });

    const io = getIO();

    io.to(`project:${projectId}`).emit(
        "project-updated",
        updatedProject
    );

    io.to(`project:${projectId}`).emit(
        "activity-created",
        activity
    );

    return updatedProject;
};

const deleteProject = async (projectId, userId) => {
    const project = await Project.findById(projectId);

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    // Only the project owner can delete it
    if (project.owner.toString() !== userId.toString()) {
        const error = new Error("Only the project owner can delete the project");
        error.statusCode = 403;
        throw error;
    }

    // Delete all tasks belonging to the project 
    await Task.deleteMany({
        project: projectId,
    });

    // Delete all comments belonging to the project
    await Comment.deleteMany({
        project: projectId,
    });

    // Delete all activities belonging to the project
    await Activity.deleteMany({
        project: projectId,
    });

    // Delete all notifications belonging to the project
    await Notification.deleteMany({
        project: projectId,
    });

    // Delete the project itself
    await Project.findByIdAndDelete(projectId);

    const io = getIO();

    io.to(`project:${projectId}`).emit(
        "project-deleted",
        {
            projectId,
        }
    );

    return {
        projectId,
    };
};

const addMember = async (projectId, ownerId, email) => {
    const project = await Project.findOne({
        _id: projectId,
    });

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    if (project.owner.toString() !== ownerId.toString()) {
        const error = new Error("Only the project owner can add members");
        error.statusCode = 403;
        throw error;
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail,
    });

    if (!user) {
        const error = new Error("User with this email does not exist");
        error.statusCode = 404;
        throw error;
    }

    const isAlreadyMember = project.members.some(
        (memberId) => memberId.toString() === user._id.toString()
    );

    if (isAlreadyMember) {
        const error = new Error("User is already a member of this project");
        error.statusCode = 400;
        throw error;
    }

    project.members.push(user._id);

    await project.save();

    const updatedProject = await Project.findOne({
        _id: project.id,
    })
        .populate("owner", "name email")
        .populate("members", "name email");
    
    const activity = await createActivity({
        projectId,
        userId: ownerId,
        type: "member-added",
        targetUserId: user._id,
        message: `${updatedProject.owner.name} added ${user.name} to the project`,
    });

    const notification = await createNotification({
        recipientId: user._id,
        projectId,
        actorId: ownerId,
        type: "member-added",
        message: `${updatedProject.owner.name} added you to the project`,
    });
    
    const io = getIO();

    const roomName = `project:${projectId}`;

    io.to(roomName).emit(
        "member-added",
        {
            projectId: projectId.toString(),
            member: {
                _id: user._id.toString(),
                name: user.name,
                email: user.email,
            },
        }
    );

    io.to(roomName).emit(
        "activity-created",
        activity
    );

    // Notify the newly added member directly
    io.to(`user:${user._id.toString()}`).emit(
        "project-member-added",
        {
            projectId: projectId.toString(),
        }
    );

    io.to(`user:${user._id.toString()}`).emit(
        "notification-created",
        notification
    );

    return updatedProject;
};

const removeMember = async (projectId, ownerId, memberId) => {
    const project = await Project.findOne({
        _id: projectId,
    });

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    if (project.owner.toString() !== ownerId.toString()) {
        const error = new Error("Only the project owner can remove members");
        error.statusCode = 403;
        throw error;
    }

    if (project.owner.toString() === memberId.toString()) {
        const error = new Error("Project owner cannot be removed");
        error.statusCode = 400;
        throw error;
    }

    const isMember = project.members.some(
        (id) => id.toString() === memberId.toString()
    );

    if (!isMember) {
        const error = new Error("User is not the member of this project");
        error.statusCode = 404;
        throw error;
    }

    const removedUser = await User.findById(memberId).select(
        "name email"
    );

    project.members = project.members.filter(
        (id) => id.toString() !== memberId.toString()
    );

    await project.save();

    const updatedProject = await Project.findOne({
        _id: project._id,
    })
        .populate("owner", "name email")
        .populate("members", "name email");
    
    const activity = await createActivity({
        projectId,
        userId: ownerId,
        type: "member-removed",
        targetUserId: memberId,
        message: `${updatedProject.owner.name} removed ${removedUser.name} from the project`,
    });

    const notification = await createNotification({
        recipientId: memberId,
        projectId,
        actorId: ownerId,
        type: "member-removed",
        message: `${updatedProject.owner.name} removed you from the project`
    })
    
    const io = getIO();

    const roomName = `project:${projectId}`;

    // notify all project members of removed member including the removed member
    io.to(roomName).emit(
        "member-removed",
        {
            projectId: projectId.toString(),
            memberId: memberId.toString(),
        }
    );

    io.to(roomName).emit(
        "activity-created",
        activity
    );

    io.to(`user:${memberId.toString()}`).emit(
        "notification-created",
        notification
    );

    // remove all active sockets of the removed member
    const sockets = await io.fetchSockets();

    for (const socket of sockets) {
        if (socket.user._id.toString() === memberId.toString()) {
            socket.leave(roomName);
        }
    }

    return updatedProject;
};

module.exports = {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
};