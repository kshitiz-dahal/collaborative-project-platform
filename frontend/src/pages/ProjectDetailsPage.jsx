import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import socket from "../socket";
import ProjectHeader from "../components/projects/ProjectHeader";
import EditProjectModal from "../components/projects/EditProjectModal";
import DeleteProjectModal from "../components/projects/DeleteProjectModal";
import MemberManagementModal from "../components/projects/MemberManagementModal";
import TaskBoard from "../components/tasks/TaskBoard";
import TaskDetailsModal from "../components/tasks/TaskDetailsModal";
import CreateTaskModal from "../components/tasks/CreateTaskModal";
import DeleteTaskModal from "../components/tasks/DeleteTaskModal";
import TaskList from "../components/tasks/TaskList";
import TaskCalendar from "../components/tasks/TaskCalendar";
import TaskToolbar from "../components/tasks/TaskToolbar";
import ActivityFeed from "../components/activity/ActivityFeed";

const ProjectDetailsPage = () => {
    const { projectId } = useParams();

    const navigate = useNavigate();

    const { user } = useAuth();

    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const [showEditProjectModal, setShowEditProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState(false);
    const [editProjectForm, setEditProjectForm] = useState({
        name: "",
        description: "",
    });
    
    const [editProjectError, setEditProjectError] = useState("");

    const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false);
    const [deletingProject, setDeletingProject] = useState(false);
    const [deleteProjectError, setDeleteProjectError] = useState("");
    
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [createTaskStatus, setCreateTaskStatus] = useState("todo");
    
    const [creatingTask, setCreatingTask] = useState(false);
    const [statusError, setStatusError] = useState("");
    
    const [showMembersModal, setShowMembersModal] = useState(false);
    
    const [addingMember, setAddingMember] = useState(false);
    const [removingMemberId, setRemovingMemberId] = useState(null);
    const [memberError, setMemberError] = useState("");
    
    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(true);
    const [tasksLoadError, setTasksLoadError] = useState("");
    const [taskError, setTaskError] = useState("");

    const [editingTaskId, setEditingTaskId] = useState(null);
    const [updatingTask, setUpdatingTask] = useState(false);

    const [newComment, setNewComment] = useState(null);

    const [updatedComment, setUpdatedComment] = useState(null);
    const [deletedComment, setDeletedComment] = useState(null);
    
    const [deletingTaskId, setDeletingTaskId] = useState(null);
    const [deletingTask, setDeletingTask] = useState(false);
    
    const [viewMode, setViewMode] = useState("board");
    
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [assigneeFilter, setAssigneeFilter] = useState("all");
    
    const [activities, setActivities] = useState([]);
    const [activitiesLoading, setActivitiesLoading] = useState(false);
    const [activitiesError, setActivitiesError] = useState("");

    const handleOpenEditProject = () => {
        setEditProjectForm({
            name: project.name || "",
            description: project.description || "",
        });

        setEditProjectError("");
        setShowEditProjectModal(true);
    };

    const handleEditProjectChange = (event) => {
        const { name, value } = event.target;

        setEditProjectForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleEditProjectSubmit = async (event) => {
        event.preventDefault();

        setEditingProject(true);
        setEditProjectError("");

        try {
            const response = await api.put(
                `/projects/${projectId}`,
                editProjectForm
            );

            setProject(response.data.project);
            setShowEditProjectModal(false);
        } catch (error) {
            setEditProjectError(
                error.response?.data?.message || "Failed to update project."
            );
        } finally {
            setEditingProject(false);
        }
    };

    const handleDeleteProject = async () => {
        setDeletingProject(true);
        setDeleteProjectError("");

        try {
            await api.delete(`/projects/${projectId}`);

            navigate("/projects");
        } catch (error) {
            setDeleteProjectError(
                error.response?.data?.message || "Failed to delete project."
            );
        } finally {
            setDeletingProject(false);
        }
    };

    const handleAddMember = async (email) => {
        try {
            setAddingMember(true);
            setMemberError("");

            await api.post(
                `/projects/${projectId}/members`,
                {
                    email,
                }
            );

            return true;
        } catch (error) {

            setMemberError(
                error.response?.data?.message ||
                "Failed to add member"
            );

            return false;
        } finally {
            setAddingMember(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        try {
            setRemovingMemberId(userId);
            setMemberError("");

            await api.delete(
                `/projects/${projectId}/members/${userId}`
            );
        } catch (error) {

            setMemberError(
                error.response?.data?.message ||
                "Failed to remove member"
            );
        } finally {
            setRemovingMemberId(null);
        }
    };

    const handleCreateTask = async (taskData) => {
        try {
            setCreatingTask(true);
            setTaskError("");

            await api.post(
                `/projects/${projectId}/tasks`,
                {
                    title: taskData.title,
                    description: taskData.description,
                    status: taskData.status,
                    priority: taskData.priority,
                    assignee: taskData.assignee || null,
                    dueDate: taskData.dueDate || null,
                }
            );

            setShowCreateTaskModal(false);
        } catch (error) {

            setTaskError(
                error.response?.data?.message ||
                "Failed to create task"
            );
        } finally {
            setCreatingTask(false);
        }
    };

    const handleUpdateTask = async (taskId, updates) => {
        try {
            setUpdatingTask(true);
            setTaskError("");

            const response = await api.put(
                `/projects/${projectId}/tasks/${taskId}`,
                updates
            );

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task._id === taskId
                        ? response.data.task
                        : task
                )
            );

            setEditingTaskId(null);
        } catch (error) {

            setTaskError(
                error.response?.data?.message ||
                "Failed to update task"
            );
        } finally {
            setUpdatingTask(false);
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            setStatusError("");

            const response = await api.put(
                `/projects/${projectId}/tasks/${taskId}`,
                {
                    status: newStatus,
                }
            );

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task._id === taskId
                        ? response.data.task
                        : task
                )
            );
        } catch (error) {
            setStatusError(
                error.response?.data?.message || "Failed to update task status"
            );
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            setDeletingTask(true);
            setTaskError("");

            await api.delete(
                `/projects/${projectId}/tasks/${taskId}`
            );

            setDeletingTaskId(null);

            setTasks((currentTasks) =>
                currentTasks.filter(
                    (task) => task._id !== taskId
                )
            );
        } catch (error) {

            setTaskError(
                error.response?.data?.message ||
                "Failed to delete task"
            );
        } finally {
            setDeletingTask(false);
        }
    };

    const filteredTasks = tasks.filter((task) => {
        const searchTerm = search.trim().toLowerCase();

        const matchesSearch = !searchTerm ||
            task.title?.toLowerCase().includes(searchTerm) ||
            task.description?.toLowerCase().includes(searchTerm);
        
        const matchesStatus = statusFilter === "all" ||
            task.status === statusFilter;
        
        const matchesPriority = priorityFilter === "all" ||
            task.priority === priorityFilter;
        
        const matchesAssignee = assigneeFilter === "all" ||
            (assigneeFilter === "unassigned"
                ? !task.assignee
                : task.assignee?._id === assigneeFilter);
        
        return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority &&
            matchesAssignee
        );
    });

    const startEditingTask = (task) => {
        setEditingTaskId(task._id);
        setTaskError("");
    };

    const openDeleteTaskModal = (task) => {

        setDeletingTaskId(task._id);
        setTaskError("");
    };

    const fetchTasks = async () => {
        try {
            setTasksLoading(true);
            setTasksLoadError("");

            const response = await api.get(
                `/projects/${projectId}/tasks`
            );

            setTasks(response.data.tasks);
        } catch (error) {
            setTasksLoadError(
                error.response?.data?.message ||
                "Failed to load tasks"
            );
        } finally {
            setTasksLoading(false);
        }
    };

    useEffect(() => {
        
        const fetchProject = async () => {
            try {
                setLoading(true);
                setError("");
                
                const response = await api.get(`/projects/${projectId}`);
                
                setProject(response.data.project);
            } catch (error) {                
                setError(
                    error.response?.data?.message ||
                    "Failed to fetch project"
                );
            } finally {
                setLoading(false);
            }
        };
        
        // const fetchTasks = async () => {
        //     try {
        //         setTasksLoading(true);
        //         setTaskError("");

        //         const response = await api.get(
        //             `/projects/${projectId}/tasks`
        //         );

        //         setTasks(response.data.tasks);
        //     } catch (error) {

        //         setTaskError(
        //             error.response?.data?.message ||
        //             "Failed to load tasks"
        //         );
        //     } finally {
        //         setTasksLoading(false);
        //     }
        // };

        const fetchActivities = async () => {
            try {
                setActivitiesLoading(true);
                setActivitiesError("");

                const response = await api.get(
                    `/projects/${projectId}/activities`
                );

                setActivities(response.data.activities);
            } catch (error) {
                setActivitiesError(
                    error.response?.data?.message || "Failed to load activity"
                );
            } finally {
                setActivitiesLoading(false);
            }
        };

        fetchProject();
        fetchTasks();
        fetchActivities();
    }, [projectId]);

    useEffect(() => {
        if (!projectId) return;

        const joinProject = () => {
            socket.emit(
                "join-project",
                { projectId },
            );
        };

        if (socket.connected) {
            joinProject();
        }

        socket.on("connect", joinProject);

        return () => {
            socket.off("connect", joinProject);
        };
    }, [projectId]);

    useEffect(() => {
        const handleActivityCreated = (activity) => {

            setActivities((currentActivities) => {
                const alreadyExists = currentActivities.some(
                    (existingActivity) => existingActivity._id === activity._id
                );

                if (alreadyExists) {
                    return currentActivities;
                }

                return [
                    activity,
                    ...currentActivities,
                ];
            });
        };

        const handleTaskCreated = (task) => {

            setTasks((currentTasks) => {
                const alreadyExists = currentTasks.some(
                    (existingTask) => existingTask._id === task._id
                );

                if (alreadyExists) {
                    return currentTasks;
                }

                return [...currentTasks, task];
            });
        };

        const handleTaskUpdated = (updatedTask) => {

            setTasks((currentTasks) =>
                currentTasks.map((task) =>
                    task._id === updatedTask._id
                        ? updatedTask
                        : task
                )
            );
        };

        const handleTaskDeleted = ({ taskId }) => {

            setTasks((currentTasks) =>
                currentTasks.filter(
                    (task) => task._id !== taskId
                )
            );
        };

        const handleMemberAdded = ({ projectId: eventProjectId, member }) => {

            if (eventProjectId !== projectId) {
                return;
            }

            setProject((currentProject) => {
                if (!currentProject) {
                    return currentProject;
                }

                const alreadyExists = currentProject.members.some(
                    (existingMember) => existingMember._id === member._id
                );

                if (alreadyExists) {
                    return currentProject;
                }

                return {
                    ...currentProject,
                    members: [
                        ...currentProject.members,
                        member,
                    ],
                };
            });
        };

        const handleMemberRemoved = ({
            projectId: eventProjectId,
            memberId, 
        }) => {

            if (eventProjectId !== projectId) {
                return;
            }

            setProject((currentProject) => {
                if (!currentProject) {
                    return currentProject;
                }

                return {
                    ...currentProject,
                    members: currentProject.members.filter(
                        (member) => member._id !== memberId
                    ),
                };
            });
        };

        const handleProjectMemberAdded = ({
            projectId: eventProjectId,
        }) => {
            if (eventProjectId !== projectId) {
                return;
            }

            api.get(`/projects/${projectId}`)
                .then((response) => {
                    setProject(response.data.project);
                })
                .catch(() => {
                    setError("Failed to refresh project");
                });
        };

        const handleProjectUpdated = (updatedProject) => {
            if (updatedProject._id !== projectId) {
                return;
            }

            setProject(updatedProject);
        };

        const handleCommentCreated = (comment) => {
            setNewComment(comment);
        };

        const handleCommentUpdated = (comment) => {
            setUpdatedComment(comment);
        };

        const handleCommentDeleted = (payload) => {
            setDeletedComment(payload);
        };

        socket.on("task-created", handleTaskCreated);
        socket.on("task-updated", handleTaskUpdated);
        socket.on("task-deleted", handleTaskDeleted);

        socket.on("member-added", handleMemberAdded);
        socket.on("member-removed", handleMemberRemoved);

        socket.on("project-member-added", handleProjectMemberAdded);

        socket.on("activity-created", handleActivityCreated);

        socket.on("project-updated", handleProjectUpdated);

        socket.on("comment-created", handleCommentCreated);
        socket.on("comment-updated", handleCommentUpdated);
        socket.on("comment-deleted", handleCommentDeleted);

        return () => {
            socket.off("task-created", handleTaskCreated);
            socket.off("task-updated", handleTaskUpdated);
            socket.off("task-deleted", handleTaskDeleted);

            socket.off("member-added", handleMemberAdded);
            socket.off("member-removed", handleMemberRemoved);

            socket.off("project-member-added", handleProjectMemberAdded);

            socket.off("activity-created", handleActivityCreated);

            socket.off("project-updated", handleProjectUpdated);

            socket.off("comment-created", handleCommentCreated);
            socket.off("comment-updated", handleCommentUpdated);
            socket.off("comment-deleted", handleCommentDeleted);
        };
    }, [projectId]);

    if (loading) {
        return (
            <div className="projects-loading">
                <div className="projects-loading-spinner" />

                <div>
                    <h2>Loading project</h2>
                    <p>Getting your workspace ready...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="project-error-state">
                <div className="project-error-icon">!</div>

                <h2>Couldn't load project</h2>

                <p>{error}</p>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (!project) {
        return <p>Project not found.</p>;
    }

    return (
        <div>
            <ProjectHeader
                project={project}
                taskCount={tasks.length}
                onAddTask={() => {
                    setCreateTaskStatus("todo");
                    setTaskError("");
                    setShowCreateTaskModal(true);
                }}
                onEditProject={handleOpenEditProject}
                isOwner={project.owner?._id === user?.id}
                onDeleteProject={() => setShowDeleteProjectModal(true)}
                viewMode={viewMode}
                onViewChange={setViewMode}
                onManageMembers={() => setShowMembersModal(true)}
            />
            
            <section className="members-section">
                <div className="section-heading">
                    <div>
                        <h2>Team Members</h2>
                        <p>
                            People working on this project
                        </p>
                    </div>

                    <span className="member-count">
                        {project.members.length}{" "}
                        {project.members.length === 1
                            ? "member"
                            : "members"} 
                    </span>
                </div>

                {project.members.length === 0 ? (
                    <div className="members-empty">
                        <div className="members-empty-icon">
                            👥
                        </div>

                        <h3>No members yet</h3>

                        <p>
                            Add people to start collaborating
                            on this project.
                        </p>
                    </div>
                ) : (
                    <div className="members-list">
                        {project.members.map((member) => {
                            const isOwner = project.owner?._id === member._id;

                            return (
                                <div
                                    className="member-row"
                                    key={member._id}
                                >
                                    <div className="member-avatar">
                                        {member.name
                                            ?.charAt(0).toUpperCase() || "?"}
                                    </div>

                                    <div className="member-info">
                                        <div className="member-name">
                                            {member.name}

                                            {isOwner && (
                                                <span className="owner-badge">
                                                    Owner
                                                </span>
                                            )}
                                        </div>

                                        <span className="member-email">
                                            {member.email}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>

            <section className="tasks-section">
                <div className="tasks-section-header">
                    <div>
                        <h2>Tasks</h2>
                        <p>
                            Manage and track work across the project
                        </p>
                    </div>

                    <span className="task-count-badge">
                        {filteredTasks.length}{" "}
                        {filteredTasks.length === 1 ? "task" : "tasks"}
                    </span>
                </div>

                <TaskToolbar
                    search={search}
                    onSearchChange={setSearch}
                    status={statusFilter}
                    onStatusChange={setStatusFilter}
                    priority={priorityFilter}
                    onPriorityChange={setPriorityFilter}
                    assignee={assigneeFilter}
                    onAssigneeChange={setAssigneeFilter}
                    projectMembers={project.members}
                    onClearFilters={() => {
                        setSearch("");
                        setStatusFilter("all");
                        setPriorityFilter("all");
                        setAssigneeFilter("all");
                    }}
                />
            </section>
                
            {tasksLoading ? (
                <div className="tasks-loading">
                    <div className="projects-loading-spinner" />

                    <div>
                        <h2>Loading tasks</h2>
                        <p>Getting your project tasks...</p>
                    </div>
                </div>
            ) : tasksLoadError ? (
                <div className="tasks-error">
                    <h3>Couldn't load tasks</h3>
                    <p>{tasksLoadError}</p>
                    <button type="button" onClick={fetchTasks}>
                        Try Again
                    </button>
                </div>
            ) : tasks.length === 0 ? (
                <div className="tasks-empty">
                    <h3>No tasks yet</h3>
                    <p>Create your first task to start tracking work.</p>
                </div>
            ) : filteredTasks.length === 0 ? (
                <div className="tasks-empty">
                    <h3>No matching tasks</h3>
                    <p>Try adjusting your search or filters.</p>
                </div>
            ) : (
                <>
                    {statusError && (
                        <div className="task-action-error">
                            {statusError}
                        </div>
                    )}
                    
                    {viewMode === "board" && (
                        <TaskBoard
                            tasks={filteredTasks}
                            onEdit={startEditingTask}
                            onDelete={openDeleteTaskModal}
                            onStatusChange={handleStatusChange}
                            
                            onAddTask={(status) => {
                                setCreateTaskStatus(status);
                                setTaskError("");
                                setShowCreateTaskModal(true);
                            }}
                        />
                    )}
                    
                    {viewMode === "list" && (
                        <TaskList
                            tasks={filteredTasks}
                            onEdit={startEditingTask}
                            onDelete={openDeleteTaskModal}
                        />
                    )}
                    
                    {viewMode === "calendar" && (
                        <TaskCalendar
                            tasks={filteredTasks}
                            onEdit={startEditingTask}
                        />
                    )}
                </>    
            )}

            {showMembersModal && (
                <MemberManagementModal
                    project={project}
                    onClose={() => {
                        setShowMembersModal(false);
                        setMemberError("");
                    }}
                    onAddMember={handleAddMember}
                    onRemoveMember={handleRemoveMember}
                    addingMember={addingMember}
                    removingMemberId={removingMemberId}
                    error={memberError}
                />
            )}

            {showEditProjectModal && (
                <EditProjectModal
                    formData={editProjectForm}
                    onChange={handleEditProjectChange}
                    onSubmit={handleEditProjectSubmit}
                    onClose={() => setShowEditProjectModal(false)}
                    loading={editingProject}
                    error={editProjectError}
                />
            )}

            {showDeleteProjectModal && (
                <DeleteProjectModal
                    projectName={project?.name}
                    onConfirm={handleDeleteProject}
                    onClose={() => {
                        if (!deletingProject) {
                            setShowDeleteProjectModal(false);
                            setDeleteProjectError("");
                        }
                    }}
                    loading={deletingProject}
                    error={deleteProjectError}
                />
            )}

            {showCreateTaskModal && (
                <CreateTaskModal
                    projectMembers={project.members}
                    initialStatus={createTaskStatus}
                    onClose={() => {
                        setShowCreateTaskModal(false);
                        setTaskError("");
                    }}
                    onSave={handleCreateTask}
                    loading={creatingTask}
                    error={taskError}
                />
            )}

            {editingTaskId && (
                <TaskDetailsModal
                    task={tasks.find(
                        (task) => task._id === editingTaskId
                    )}
                    project={project}
                    projectMembers={project.members}
                    onClose={() => setEditingTaskId(null)}
                    onSave={handleUpdateTask}
                    loading={updatingTask}
                    error={taskError}
                    newComment={newComment}
                    updatedComment={updatedComment}
                    deletedComment={deletedComment}
                />
            )}

            {deletingTaskId && (
                <DeleteTaskModal
                    task={tasks.find(
                        (task) => task._id === deletingTaskId
                    )}
                    onClose={() => setDeletingTaskId(null)}
                    onConfirm={handleDeleteTask}
                    loading={deletingTask}
                />
            )}


            {activitiesError ? (
                <div className="activity-error">
                    <p>{activitiesError}</p>
                    <button type="button" onClick={fetchActivities}>
                        Try Again
                    </button>
                </div>
            ) : (
                <ActivityFeed
                    activities={activities}
                    loading={activitiesLoading}
                />
            )}
        </div>
    );
};

export default ProjectDetailsPage;