const Task = require("../models/Task");
const { getProjectById } = require("./project.service");

const buildProjectContext = async (projectId, userId) => {
    const project = await getProjectById(projectId, userId);

    const taskStats = await Task.aggregate([
        {
            $match: {
                project: project._id
            }
        },
        {
            $group: {
                _id: null,
                total: { $sum: 1 },
                completedTasks: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "completed"] },
                            1,
                            0
                        ]
                    }
                },
                inProgressTasks: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "in-progress"] },
                            1,
                            0
                        ]
                    }
                },
                todoTasks: {
                    $sum: {
                        $cond: [
                            { $eq: ["$status", "todo"] },
                            1,
                            0
                        ]
                    }
                },
                overdueTasks: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $ne: ["$dueDate", null] },
                                    { $lt: ["$dueDate", new Date()] },
                                    { $ne: ["$status", "completed"] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                },
                unassignedTasks: {
                    $sum: {
                        $cond: [
                            { $eq: ["$assignee", null] },
                            1,
                            0
                        ]
                    }
                }
            }
        }
    ])

    const stats = taskStats[0]
        ? {
            total: taskStats[0].total,
            byStatus: {
                completed: taskStats[0].completedTasks,
                inProgress: taskStats[0].inProgressTasks,
                todo: taskStats[0].todoTasks,
            },
            overdue: taskStats[0].overdueTasks,
            unassigned: taskStats[0].unassignedTasks
        }
        : {
            total: 0,
            byStatus: {
                completed: 0,
                inProgress: 0,
                todo: 0,
            },
            overdue: 0,
            unassigned: 0
    };

    const recentTasks = await Task.find({
        project: project._id
    })
        .select("title status priority dueDate updatedAt")
        .sort({ updatedAt: -1, _id: -1 })
        .limit(20);
    
    const contextTasks = recentTasks.map((task) => {
        return {
            title: task.title,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            updatedAt: task.updatedAt,
        };
    });
    
    return {
        project: {
            name: project.name,
            description: project.description
        },
        stats,
        contextTasks,
    };
};

module.exports = { buildProjectContext };