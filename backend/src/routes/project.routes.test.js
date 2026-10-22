jest.mock("../services/ai-project-context.service");
jest.mock("../services/gemini.service");

require("dotenv").config();

const request = require("supertest");
const app = require("../app");

const { generateToken } = require("../utils/jwt");
const { buildProjectContext } = require("../services/ai-project-context.service");
const { generateProjectSummary } = require("../services/gemini.service");

describe("GET /api/projects/:projectId/ai-summary", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test("rejects requests without authentication", async () => {
        const response = await request(app).get("/api/projects/project123/ai-summary");

        expect(response.status).toBe(401);

        expect(response.body).toEqual({
            success: false,
            message: "Authentication required"
        });
    });

    test("returns a summary when authenticated", async () => {
        buildProjectContext.mockResolvedValue({
            project: { name: "Test Project" },
            stats: { total: 5 },
            contextTasks: []
        });

        generateProjectSummary.mockResolvedValue(
            "Project progress is on track."
        );

        const token = await generateToken("user456");

        const response = await request(app)
            .get("/api/projects/project123/ai-summary")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(200);

        expect(response.body).toEqual({
            success: true,
            summary: "Project progress is on track."
        });

        expect(buildProjectContext).toHaveBeenCalledWith(
            "project123",
            "user456"
        );

        expect(generateProjectSummary).toHaveBeenCalledWith({
            project: { name: "Test Project" },
            stats: { total: 5 },
            contextTasks: []
        });
    });

    test("rejects with status code 403", async () => {
        buildProjectContext.mockRejectedValue(
            Object.assign(new Error("Access denied"), { statusCode: 403 })
        );

        const token = await generateToken("user456");

        const response = await request(app)
            .get("/api/projects/project123/ai-summary")
            .set("Authorization", `Bearer ${token}`);

        expect(response.status).toBe(403);

        expect(response.body).toEqual({
            success: false,
            message: "Access denied"
        });

        expect(generateProjectSummary).not.toHaveBeenCalled();
    });
});