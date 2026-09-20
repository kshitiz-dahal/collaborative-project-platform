import { useEffect, useState } from "react";
import socket from "../socket";
import { useProjects } from "../context/ProjectContext";
import ProjectCard from "../components/projects/ProjectCard";
import CreateProjectModal from "../components/projects/CreateProjectModal";
import { useAuth } from "../context/AuthContext";

const ProjectsPage = () => {
    const {
        projects,
        loading,
        fetchProjects,
        createProject,
    } = useProjects();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    const [error, setError] = useState("");
    const [showCreateForm, setShowCreateForm] = useState(false);

    const { user } = useAuth();

    const [activeTab, setActiveTab] = useState("all");

    useEffect(() => {
        fetchProjects();

        const handleProjectMemberAdded = ({
            projectId,
        }) => {
            fetchProjects();
        };

        socket.on("project-member-added", handleProjectMemberAdded);

        return () => {
            socket.off("project-member-added", handleProjectMemberAdded);
        };
    }, []);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError("");

            await createProject(formData);

            setFormData({
                name: "",
                description: "",
            });

            setShowCreateForm(false);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to create project"
            );
        }
    };

    const filteredProjects = projects.filter((project) => {
        if (activeTab === "owned") {
            return project.owner?._id === user?.id;
        }

        if (activeTab === "shared") {
            return project.owner?._id !== user?.id;
        }

        return true;
    });

    if (loading && projects.length === 0) {
        return (
            <div className="projects-loading">
                <div className="projects-loading-spinner" />

                <div>
                    <h2>Loading Projects</h2>
                    <p>Getting your workspace ready...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="projects-page">
            <div className="projects-header">
                <div>
                    <span className="page-eyebrow">WORKSPACE</span>

                    <h1>Projects</h1>

                    <p>
                        Manage your projects and collaborate with your team.
                    </p>
                </div>

                <button
                    type="button"
                    className="primary-button"
                    onClick={() => {
                        setError("");
                        setShowCreateForm(true);
                    }}
                >
                    + New Project
                </button>
            </div>
            <div className="project-tabs">
                <button
                    type="button"
                    className={`project-tab ${activeTab === "all" ? "active" : ""}`}
                    onClick={() => setActiveTab("all")}
                >
                    All Projects
                </button>

                <button
                    type="button"
                    className={`project-tab ${activeTab === "owned" ? "active" : ""}`}
                    onClick={() => setActiveTab("owned")}
                >
                    Owned by me
                </button>

                <button
                    type="button"
                    className={`project-tab ${activeTab === "shared" ? "active" : ""}`}
                    onClick={() => setActiveTab("shared")}
                >
                    Shared with me
                </button>
            </div>

            {error && (
                <div className="projects-error">
                    {error}
                </div>
            )}

            {filteredProjects.length === 0 ? (
                <div className="projects-empty">
                    <div className="projects-empty-icon">
                        ▣
                    </div>

                    <h2>No projects yet</h2>

                    <p>
                        Create your first project to start collaborating
                        with your team.
                    </p>

                    <button
                        type="button"
                        className="primary-button"
                        onClick={() => {
                            setError("");
                            setShowCreateForm(true);
                        }}
                    >
                        + Create Project
                    </button>
                </div>
            ) : (
                <div className="projects-grid">
                    {filteredProjects.map((project) => (
                        <ProjectCard
                            key={project._id}
                            project={project}
                        />
                    ))}
                </div>
            )}

            {showCreateForm && (
                <CreateProjectModal
                    formData={formData}
                    onChange={handleChange}
                    onSubmit={handleSubmit}
                    onClose={() => setShowCreateForm(false)}
                    loading={loading}
                    error={error}
                />
            )}
        </div>
    );
};

export default ProjectsPage;