jest.mock("../services/ai-project-context.service");
jest.mock("../services/gemini.service");

const { buildProjectContext } = require("../services/ai-project-context.service");
const { generateProjectSummary } = require("../services/gemini.service");
const { getProjectSummary } = require("../controllers/ai-project.controller");

describe("getProjectSummary", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("returns a summary when a context and generation succeeds", async () => {
        buildProjectContext.mockResolvedValue({
            project: { name: "Test Project" },
            stats: { total: 5 },
            contextTasks: []
        });

        generateProjectSummary.mockResolvedValue(
            "The project is progressing well."
        );

        const req = {
            params: { projectId: "project123" },
            user: { id: "user456" }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getProjectSummary(req, res);

        expect(res.status).toHaveBeenCalledWith(200);

        expect(res.json).toHaveBeenCalledWith({
            success: true,
            summary: "The project is progressing well."
        });
    });

    test("stops when Gemini is unavailable", async () => {
        buildProjectContext.mockResolvedValue({
            project: { name: "Test Project" },
            stats: { total: 5 },
            contextTasks: []
        });

        const geminiError = Object.assign(
            new Error("Gemini API request failed: 502"),
            { statusCode: 502 }
        );

        generateProjectSummary.mockRejectedValue(geminiError);

        const req = {
            params: { projectId: "project123" },
            user: { id: "user456" }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getProjectSummary(req, res);

        expect(res.status).toHaveBeenCalledWith(502);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Unable to generate project summary"
        });
    });

    test("stops when building the project context fails", async () => {
        buildProjectContext.mockRejectedValue(
            Object.assign(new Error("Access denied"), { statusCode: 403 })
        );

        const req = {
            params: { projectId: "project123" },
            user: { id: "user456" }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getProjectSummary(req, res);

        expect(res.status).toHaveBeenCalledWith(403);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Access denied"
        });

        expect(generateProjectSummary).not.toHaveBeenCalled();
    });

    test("returns a generic 500 when an unexpected error occurs", async () => {
        buildProjectContext.mockRejectedValue(new Error("Sensitive internal implementation detail"));

        const req = {
            params: { projectId: "project123" },
            user: { id: "user456" }
        };

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await getProjectSummary(req, res);

        expect(res.status).toHaveBeenCalledWith(500);

        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: "Internal server error"
        });

        expect(generateProjectSummary).not.toHaveBeenCalled();
    });
});