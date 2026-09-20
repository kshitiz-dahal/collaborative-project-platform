import { Link } from "react-router-dom";

const ProjectCard = ({ project }) => {
    const memberCount = project.members?.length || 0;

    const formatRelativeTime = (date) => {
        if (!date) return "No recent updates";

        const seconds = Math.floor(
            (Date.now() - new Date(date).getTime()) / 1000
        );

        if (seconds < 60) {
            return "Just now";
        }

        const minutes = Math.floor(seconds / 60);

        if (minutes < 60) {
            return `${minutes}m ago`;
        }

        const hours = Math.floor(minutes / 60);

        if (hours < 24) {
            return `${hours}h ago`;
        }

        const days = Math.floor(hours / 24);

        if (days < 7) {
            return `${days}d ago`;
        }

        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <Link
            to={`/projects/${project._id}`}
            className="project-card"
        >
            <div className="project-card-top">
                <div className="project-icon">
                    ▣
                </div>
            </div>

            <div className="project-card-content">
                <h3>{project.name}</h3>

                <p>
                    {project.description || "No description provided."}
                </p>
            </div>

            <div className="project-members">
                {project.members?.slice(0, 3).map((member) => (
                    <div
                        key={member._id}
                        className="member-avatar-small"
                        title={member.name}
                    >
                        {member.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                ))}

                {memberCount > 3 && (
                    <div className="member-avatar-small member-more">
                        +{memberCount - 3}
                    </div>
                )}
            </div>

            <div className="project-stats">
                <div>
                    <strong>{project.totalTasks || 0}</strong>
                    <span>Tasks</span>
                </div>

                <div>
                    <strong>{memberCount}</strong>
                    <span>Members</span>
                </div>

                <div>
                    <strong>{project.progress || 0}%</strong>
                    <span>Progress</span>
                </div>
            </div>

            <div className="project-progress">
                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${project.progress || 0}%` }}
                    />
                </div>
            </div>

            <div className="project-card-footer">
                <span className="project-status">
                    <span className="project-status-dot" />
                    Active
                </span>

                <span className="project-updated">
                    Updated {formatRelativeTime(project.updatedAt)}
                </span>
            </div>
        </Link>
    );
};

export default ProjectCard;