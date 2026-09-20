const {
    getProjectActivities,
} = require("../services/activity.service");

const getActivities = async (req, res, next) => {
    try {
        const { projectId } = req.params;

        const activities = await getProjectActivities(
            projectId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            activities,
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getActivities,
};