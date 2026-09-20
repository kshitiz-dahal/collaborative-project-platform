import { Link } from "react-router-dom";

const ProjectHeader = ({
    project,
    taskCount,
    onAddTask,
    viewMode,
    onViewChange,
    onManageMembers,
    onEditProject,
    onDeleteProject,
    isOwner,
}) => {
    const memberCount = project.members?.length || 0;

    const completedTasks = project.completedTasks || 0;

    const progress = taskCount > 0
        ? Math.round((completedTasks / taskCount) * 100)
        : 0;
    
    return(
        <div className = "project-header" >
            <div className="project-header-top">
                <Link
                    to="/projects"
                    className="back-to-projects"
                >
                    ← Projects
                </Link>

                <div className="project-header-actions">
                    <button
                        className="primary-button"
                        onClick={onAddTask}
                    >
                        + Add Task
                    </button>

                    {isOwner && (
                        <>
                            <button
                                type="button"
                                className="secondary-button"
                                onClick={onEditProject}
                            >
                                Edit Project
                            </button>

                            <button 
                                type="button"
                                className="danger-button"
                                onClick={onDeleteProject}
                            >
                                Delete
                            </button>
                        </>
                    )}

                </div>
            </div>

            <div className="project-header-main">
                <div className="project-header-info">
                    <div className="project-header-icon">
                        ▣
                    </div>

                    <div>
                        <div className="project-title-row">
                            <h1>{project.name}</h1>

                            <span className="project-status-badge">
                                Active
                            </span>
                        </div>

                        <p>
                            {project.description ||
                                "No description provided."}
                        </p>
                    </div>
                </div>

                <div className="project-header-stats">
                    <div className="project-header-stat">
                        <strong>{taskCount}</strong>
                        <span>Tasks</span>
                    </div>

                    <div className="project-header-stat">
                        <strong>{memberCount}</strong>
                        <span>Members</span>
                    </div>

                    <div className="project-header-stat">
                        <strong>{progress}%</strong>
                        <span>Progress</span>
                    </div>
                </div>
            </div>

            <div className="project-header-bottom">
                <button
                    type="button"
                    className="project-members-preview"
                    onClick={onManageMembers}
                >
                    <div className="member-avatar-stack">
                        {project.members
                            ?.slice(0, 5)
                            .map((member) => (
                                <div
                                    key={member._id}
                                    className="project-member-avatar"
                                    title={member.name}
                                >
                                    {member.name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>
                            ))}
                        
                        {memberCount > 5 && (
                            <div className="project-member-avatar member-more">
                                +{memberCount - 5}
                            </div>
                        )}
                    </div>

                    <span>
                        {memberCount}{" "}
                        {memberCount === 1
                            ? "member"
                            : "members"}
                    </span>
                </button>

                <div className="project-view-tabs">
                    <button
                        type="button"
                        className={`project-view-tab ${
                            viewMode === "board" ? "active" : ""
                        }`}
                        onClick={() => onViewChange("board")}
                    >
                        <span className="view-tab-icon">▦</span>
                        Board
                    </button>

                    <button
                        type="button"
                        className={`project-view-tab ${
                            viewMode === "list" ? "active" : ""
                        }`}
                        onClick={() => onViewChange("list")}
                    >
                        <span className="view-tab-icon">☷</span>
                        List
                    </button>

                    <button
                        type="button"
                        className={`project-view-tab ${
                            viewMode === "calendar" ? "active" : ""
                        }`}
                        onClick={() => onViewChange("calendar")}
                    >
                        <span className="view-tab-icon">□</span>
                        Calendar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProjectHeader;