const {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
    addMember,
    removeMember,
} = require("../services/project.service");

const create = async (req, res) => {
    try {
        const { name, description } = req.body;

        const project = await createProject({
            name,
            description,
            userId: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: "Project created successfully",
            project,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const getMyProjects = async (req, res) => {
    try {
        const projects = await getUserProjects(req.user.id);

        res.status(200).json({
            success: true,
            projects,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const getById = async (req, res) => {
    try {
        const project = await getProjectById(
            req.params.projectId,
            req.user.id,
        );

        res.status(200).json({
            success: true,
            project,
        });
    } catch (error) {
        res.status(error.statusCode || 404).json({
            success: false,
            message: error.message,
        });
    }
};

const update = async (req, res) => {
    try {
        const project = await updateProject(
            req.params.projectId,
            req.user.id,
            req.body,
        );

        res.status(200).json({
            success: true,
            message: "Project updated successfully",
            project,
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
        const result = await deleteProject(
            req.params.projectId,
            req.user.id
        );

        res.status(200).json({
            success: true,
            message: "Project deleted successfully",
            ...result,
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};

const addProjectMember = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email || !email.trim()) {
            return res.status(400).json({
                success: false,
                message: "Email is required",
            });
        }

        const project = await addMember(
            req.params.projectId,
            req.user.id,
            email
        );

        res.status(200).json({
            success: true,
            message: "Member added successfully",
            project,
        });
    } catch (error) {
        res.status(error.statusCode || 400).json({
            success: false,
            message: error.message,
        });
    }
};

const removeProjectMember = async (req, res) => {
    try {
        const project = await removeMember(
            req.params.projectId,
            req.user.id,
            req.params.userId,
        );

        res.status(200).json({
            success: true,
            message: "Member removed successfully",
            project,
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
    getMyProjects,
    getById,
    update,
    remove,
    addProjectMember,
    removeProjectMember,
};