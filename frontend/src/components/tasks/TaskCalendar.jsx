import { useMemo, useState } from "react";

const TaskCalendar = ({
    tasks,
    onEdit,
}) => {
    const [currentDate, setCurrentDate] = useState(
        new Date()
    );

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthName = currentDate.toLocaleDateString(
        "en-US",
        {
            month: "long",
            year: "numeric",
        }
    );

    const daysInMonth = new Date(
        year,
        month + 1,
        0
    ).getDate();

    const firstDay = new Date(
        year,
        month,
        1
    ).getDate();

    const calendarDays = useMemo(() => {
        const days = [];

        // previous month's empty slots
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Current month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    }, [firstDay, daysInMonth]);

    const getTasksforDay = (day) => {
        if (!day) return [];

        return tasks.filter((task) => {
            if (!task.dueDate) return false;

            const dueDate = new Date(task.dueDate);

            return (
                dueDate.getFullYear() === year &&
                dueDate.getMonth() === month &&
                dueDate.getDate() === day
            );
        });
    };

    const goToPreviousMonth = () => {
        setCurrentDate(
            new Date(year, month - 1, 1)
        );
    };

    const goToNextMonth = () => {
        setCurrentDate(
            new Date(year, month + 1, 1)
        );
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };
    
    return (
        <div className="task-calendar">
            <div className="calendar-toolbar">
                <div>
                    <h2>{monthName}</h2>

                    <p>
                        Tasks scheduled for this month
                    </p>
                </div>

                <div className="calendar-controls">
                    <button
                        type="button"
                        onClick={goToToday}
                    >
                        Today
                    </button>

                    <button
                        type="button"
                        onClick={goToPreviousMonth}
                    >
                        ←
                    </button>

                    <button
                        type="button"
                        onClick={goToNextMonth}
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="calendar-weekdays">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
            </div>

            <div className="calendar-grid">
                {calendarDays.map((day, index) => {
                    const dayTasks = getTasksforDay(day);
                    
                    const isToday = day
                        && new Date().getDate() === day
                        && new Date().getMonth() === month
                        && new Date().getFullYear() === year;
                    
                    const visibleTasks = dayTasks.slice(0, 3);
                    const remainingTasks = dayTasks.length - visibleTasks.length;

                    return (
                        <div
                            key={index}
                            className={`calendar-day ${day
                                ? ""
                                : "calendar-empty-day"
                                } ${isToday ? "calendar-today" : ""}`}
                        >
                            {day && (
                                <>
                                    <div className="calendar-day-number">
                                        <span
                                            className={
                                                isToday
                                                    ? "today-number"
                                                    : ""
                                            }
                                        >
                                            {day}
                                        </span>
                                        
                                    </div>

                                    <div className="calendar-day-tasks">
                                        {dayTasks.map(
                                            (task) => (
                                                <button
                                                    type="button"
                                                    key={task._id}
                                                    className={`calendar-task calendar-task-${task.priority}`}
                                                    onClick={() =>
                                                        onEdit(task)
                                                    }
                                                    title={task.title}
                                                >
                                                    <span
                                                        className="calendar-task-status"
                                                    >
                                                        {task.status === "completed"
                                                            ? "✓" 
                                                            : task.status === "in-progress" ? "●" : "○"
                                                        }
                                                    </span>

                                                    <span>
                                                        {task.title}
                                                    </span>
                                                </button>
                                            )
                                        )}
                                        {remainingTasks > 0 && (
                                            <span className="calendar-more">
                                                +{remainingTasks} more
                                            </span>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default TaskCalendar;