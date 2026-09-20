const Activity = require("../models/Activity");
const Project = require("../models/Project");


const createActivity = async ({
    projectId,
    userId,
    type,
    taskId = null,
    targetUserId = null,
    message,
}) => {
    const activity = await Activity.create({
        project: projectId,
        user: userId,
        type,
        task: taskId,
        targetUser: targetUserId,
        message,
    });

    const populatedActivity = await Activity.findById(
        activity._id
    )
        .populate("user", "name email")
        .populate("targetUser", "name email")
        .populate("task", "title");

    return populatedActivity;
};

const getProjectActivities = async (projectId, userId) => {
    const project = await Project.findById(projectId);

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    const isMember = project.members.some(
        (memberId) => memberId.toString() === userId.toString()
    );

    if (!isMember) {
        const error = new Error(
            "You are not a member of this project"
        );
        error.statusCode = 403;
        throw error;
    }

    const activities = await Activity.find({
        project: projectId,
    })
        .populate("user", "name email")
        .populate("targetUser", "name email")
        .populate("task", "title")
        .sort({ createdAt: -1 });

    return activities;
};

module.exports = {
    createActivity,
    getProjectActivities,
};