import TaskCard from "./TaskCard";
import {
    DragDropContext,
    Droppable,
    Draggable,
} from "@hello-pangea/dnd";

const TaskBoard = ({
    tasks,
    onEdit,
    onDelete,
    onStatusChange,
    onAddTask,
}) => {

    const columns = [
        {
            id: "todo",
            title: "Todo",
        },
        {
            id: "in-progress",
            title: "In Progress",
        },
        {
            id: "completed",
            title: "Completed",
        },
    ];

    const handleDragEnd = (result) => {
        const { destination, source, draggableId } = result;

        // Dropped outside the columns
        if (!destination) return;

        // Dropped in the same position
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const task = tasks.find(
            (task) => task._id === draggableId
        );

        if (!task) return;

        const newStatus = destination.droppableId;

        // only update backend if status changed
        if (task.status != newStatus) {
            onStatusChange(task._id, newStatus);
        }
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div className="task-board">
                {columns.map((column) => {
                    const columnTasks = tasks.filter(
                        (task) => task.status === column.id
                    );

                    return (
                        <Droppable
                            droppableId={column.id}
                            key={column.id}
                        >
                            {(provided, snapshot) => (
                                <div
                                    className={`task-column ${
                                        snapshot.isDraggingOver
                                            ? "task-column-dragging"
                                            : ""
                                    }`}
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                >
                                    <div className="task-column-header">
                                        <div>
                                            <h3>{column.title}</h3>

                                            <span>
                                                {columnTasks.length}{" "}
                                                {columnTasks.length === 1
                                                    ? "task"
                                                    : "tasks"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="task-column-content">
                                        {columnTasks.length === 0 && (
                                            <div className="empty-column">
                                                No Tasks
                                            </div>
                                        )}

                                        {columnTasks.map(
                                            (task, index) => (
                                                <Draggable
                                                    key={task._id}
                                                    draggableId={task._id}
                                                    index={index}
                                                >
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={
                                                                provided.innerRef
                                                            }
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={
                                                                snapshot.isDragging
                                                                    ? "task-dragging"
                                                                    : ""
                                                            }
                                                        >
                                                            <TaskCard
                                                                task={task}
                                                                onEdit={onEdit}
                                                                onDelete={onDelete}
                                                            />
                                                        </div>
                                                    )}
                                                </Draggable>
                                            )
                                        )}

                                        {provided.placeholder}
                                    </div>

                                    <button
                                        type="button"
                                        className="add-task-column"
                                        onClick={() => onAddTask(column.id)}
                                    >
                                        + Add task
                                    </button>
                                </div>
                            )}
                        </Droppable>
                    );
                })}
            </div>
        </DragDropContext>
    );
};

export default TaskBoard;