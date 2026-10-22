jest.mock("../models/Task");
jest.mock("./project.service");

const Task = require("../models/Task");
const { getProjectById } = require("./project.service");
const { buildProjectContext } = require("./ai-project-context.service");

const mockProject = {
    _id: "project123",
    name: "SyncForge",
    description: "Real-time project management system"
};

describe("buildProjectContext", () => {
    test("stops when project authorization fails", async () => {
        getProjectById.mockRejectedValue(new Error("Forbidden"));

        await expect(buildProjectContext("project123", "user456")).rejects.toThrow("Forbidden");
        expect(Task.aggregate).not.toHaveBeenCalled();
        expect(Task.find).not.toHaveBeenCalled();
    });

    test("returns project context when authorization succeeds", async () => {
        getProjectById.mockResolvedValue(mockProject);

        Task.aggregate.mockResolvedValue([
            {
                _id: null,
                total: 1,
                completedTasks: 0,
                inProgressTasks: 1,
                todoTasks: 0,
                overdueTasks: 0,
                unassignedTasks: 0
            }
        ]);
        
        const mockTasks = [
            {
                title: "Implementation notifications",
                status: "in-progress",
                priority: "high",
                dueDate: null,
                updatedAt: new Date("2026-10-15T10:00:00Z")
            }
        ];

        const mockQuery = {
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn()
        };

        mockQuery.limit.mockResolvedValue(mockTasks);
        Task.find.mockReturnValue(mockQuery);

        const result = await buildProjectContext("project123", "user456");

        expect(result.project).toEqual({
            name: "SyncForge",
            description: "Real-time project management system"
        });

        expect(result.stats).toEqual({
            total: 1,
            byStatus: {
                completed: 0,
                inProgress: 1,
                todo: 0
            },
            overdue: 0,
            unassigned: 0
        });

        expect(result.contextTasks).toEqual(mockTasks);

        expect(Task.find).toHaveBeenCalledWith({
            project: mockProject._id
        });

        expect(mockQuery.select).toHaveBeenCalledWith(
            "title status priority dueDate updatedAt"
        );

        expect(mockQuery.sort).toHaveBeenCalledWith({
            updatedAt: -1,
            _id: -1
        });

        expect(mockQuery.limit).toHaveBeenCalledWith(20);
    });

    test("returns zero statistics when the project has no tasks", async () => {
        getProjectById.mockResolvedValue(mockProject);

        Task.aggregate.mockResolvedValue([]);

        const mockTasks = [];

        const mockQuery = {
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn()
        };

        mockQuery.limit.mockResolvedValue(mockTasks);
        Task.find.mockReturnValue(mockQuery);

        const result = await buildProjectContext("project123", "user456");

        expect(result.project).toEqual({
            name: "SyncForge",
            description: "Real-time project management system"
        });

        expect(result.stats).toEqual({
            total: 0,
            byStatus: {
                completed: 0,
                inProgress: 0,
                todo: 0
            },
            overdue: 0,
            unassigned: 0
        });

        expect(result.contextTasks).toEqual(mockTasks);
    });

    test("excludes unapproved fields from AI context", async () => {
        getProjectById.mockResolvedValue(mockProject);

        Task.aggregate.mockResolvedValue([
            {
                _id: null,
                total: 1,
                completedTasks: 0,
                inProgressTasks: 1,
                todoTasks: 0,
                overdueTasks: 0,
                unassignedTasks: 0
            }
        ]);

        const mockTasks = [
            {
                title: "Implementation notifications",
                status: "in-progress",
                priority: "high",
                dueDate: null,
                updatedAt: new Date("2026-10-15T10:00:00Z"),
                internalNotes: "Confidential discussion",
                someUnneededField: "Not relevant to the AI summary"
            }
        ];

        const mockQuery = {
            select: jest.fn().mockReturnThis(),
            sort: jest.fn().mockReturnThis(),
            limit: jest.fn()
        };

        mockQuery.limit.mockResolvedValue(mockTasks);
        Task.find.mockReturnValue(mockQuery);

        const result = await buildProjectContext("project123", "user456");

        expect(mockQuery.select).toHaveBeenCalledWith("title status priority dueDate updatedAt");

        expect(result.contextTasks[0]).not.toHaveProperty("internalNotes");
        expect(result.contextTasks[0]).not.toHaveProperty("someUnneededField");
    });
});