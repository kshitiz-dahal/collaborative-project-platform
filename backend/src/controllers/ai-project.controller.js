const { buildProjectContext } = require("../services/ai-project-context.service");
const { generateProjectSummary } = require("../services/gemini.service");

const getProjectSummary = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const userId = req.user.id;

        const context = await buildProjectContext(projectId, userId);
        const summary = await generateProjectSummary(context);

        return res.status(200).json({
            success: true,
            summary
        });
    } catch (error) {
        const statusCode = [403, 502].includes(error.statusCode)
            ? error.statusCode : 500;
        
        const publicMessages = {
            403: "Access denied",
            502: "Unable to generate project summary",
            500: "Internal server error"
        };

        // Log technical details server-side using your logger.
        // Do not log API keys, tokens, or sensitive project content.

        return res.status(statusCode).json({
            success: false,
            message: publicMessages[statusCode]
        });
    }
};

module.exports = { getProjectSummary };