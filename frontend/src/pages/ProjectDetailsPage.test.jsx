import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ProjectDetailsPage from "./ProjectDetailsPage";
import api from "../api/axios";

vi.mock("../api/axios", () => ({
    default: {
        get: vi.fn(),
    },
}));

const mockRoute = vi.hoisted(() => ({
    projectId: "project-123",
}));

vi.mock("react-router-dom", () => ({
    useParams: () => ({ projectId: mockRoute.projectId }),
    useNavigate: () => vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
    useAuth: () => ({
        user: { id: "user-123" },
    }),
}));

vi.mock("../socket", () => ({
    default: {
        connected: false,
        emit: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
    },
}));

vi.mock("../components/projects/ProjectHeader", () => ({
    default: () => <h1>Project Test</h1>,
}));

vi.mock("../components/tasks/TaskToolbar", () => ({
    default: () => null,
}));

vi.mock("../components/activity/ActivityFeed", () => ({
    default: () => null,
}));

vi.mock("../components/tasks/TaskBoard", () => ({
    default: () => null,
}));

vi.mock("../components/tasks/TaskList", () => ({
    default: () => null,
}));

vi.mock("../components/tasks/TaskCalendar", () => ({
    default: () => null,
}));

describe("ProjectDetailsPage AI Summary", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        mockRoute.projectId = "project-123";

        api.get.mockImplementation(async (url) => {
            if (url === "/projects/project-123") {
                return {
                    data: {
                        project: {
                            _id: "project-123",
                            name: "Test Project",
                            description: "A test project",
                            owner: { _id: "user-123" },
                            members: []
                        },
                    },
                };
            }

            if (url === "/projects/project-123/tasks") {
                return { data: { tasks: [] } };
            }

            if (url === "/projects/project-123/activities") {
                return { data: { activities: [] } };
            }

            if (url === "/projects/project-123/ai-summary") {
                return {
                    data: {
                        success: true,
                        summary: "## Project Progress\n\n**Good Progress** so far.",
                    },
                };
            }

            throw new Error(`Unexpected API request: ${url}`);
        });
    });

    it("renders the generated AI summary after clicking Generate Summary", async () => {
        const user = userEvent.setup();

        render(<ProjectDetailsPage />);

        const generateButton = await screen.findByRole("button", {
            name: "Generate Summary",
        });

        await user.click(generateButton);

        expect(
            await screen.findByRole("heading", {
                name: "Project Progress",
            })
        ).toBeInTheDocument();

        expect(screen.getByText("Good Progress")).toBeInTheDocument();

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(
                "/projects/project-123/ai-summary"
            );
        });
    });

    it("shows a loading state while the AI summary request is pending", async () => {
        const user = userEvent.setup();

        let resolveSummaryRequest;

        api.get.mockImplementation((url) => {
            if (url === "/projects/project-123/ai-summary") {
                return new Promise((resolve) => {
                    resolveSummaryRequest = resolve;
                });
            }

            // Keep the normal project-page requests working.
            if (url === "/projects/project-123") {
                return Promise.resolve({
                    data: {
                        project: {
                            _id: "project-123",
                            name: "Test Project",
                            description: "A test project",
                            owner: { _id: "user-123" },
                            members: [],
                        },
                    },
                });
            }

            if (url === "/projects/project-123/tasks") {
                return Promise.resolve({ data: { tasks: [] } });
            }

            if (url === "/projects/project-123/activities") {
                return Promise.resolve({ data: { activities: [] } });
            }

            throw new Error(`Unexpected API request: ${url}`);
        });

        render(<ProjectDetailsPage />);

        const generateButton = await screen.findByRole("button", {
            name: "Generate Summary",
        });

        await user.click(generateButton);

        expect(
            screen.getByRole("button", { name: "Generating..." })
        ).toBeDisabled();

        expect(
            screen.getByRole("status")
        ).toHaveTextContent(/generating your summary/i);

        
        resolveSummaryRequest({
            data: {
                success: true,
                summary: "Summary generated successfully."
            },
        });

        expect(
            await screen.findByText("Summary generated successfully.")
        ).toBeInTheDocument();

        expect(
            await screen.findByRole("button", { name: "Regenerate Summary" })
        ).toBeEnabled();
    });

    it("displays an error when the AI summary request fails", async () => {
        const user = userEvent.setup();

        api.get.mockImplementation(async (url) => {
            if (url === "/projects/project-123/ai-summary") {
                return Promise.reject({
                    response: {
                        data: {
                            message: "Unable to generate project summary"
                        },
                    },
                });
            }

            // Keep the normal project-page requests working.
            if (url === "/projects/project-123") {
                return Promise.resolve({
                    data: {
                        project: {
                            _id: "project-123",
                            name: "Test Project",
                            description: "A test project",
                            owner: { _id: "user-123" },
                            members: [],
                        },
                    },
                });
            }

            if (url === "/projects/project-123/tasks") {
                return Promise.resolve({ data: { tasks: [] } });
            }

            if (url === "/projects/project-123/activities") {
                return Promise.resolve({ data: { activities: [] } });
            }

            throw new Error(`Unexpected API request: ${url}`);
        });

        render(<ProjectDetailsPage />);

        const generateButton = await screen.findByRole("button", {
            name: "Generate Summary",
        });

        await user.click(generateButton);

        expect(await screen.findByRole("alert"))
            .toHaveTextContent("Unable to generate project summary");

    });

    it("does not show a stale error after switching projects", async () => {
        const user = userEvent.setup();

        let rejectProjectARequest;
        
        api.get.mockImplementation((url) => {
            if (url === "/projects/project-A/ai-summary") {
                return new Promise((resolve, reject) => {
                    rejectProjectARequest = reject;
                });
            }

            // Keep the normal project-page requests working.
            // For Project A
            if (url === "/projects/project-A") {
                return Promise.resolve({
                    data: {
                        project: {
                            _id: "project-A",
                            name: "Test Project A",
                            description: "A test project for Project A",
                            owner: { _id: "user-123" },
                            members: [],
                        },
                    },
                });
            }

            // For Project B
            if (url === "/projects/project-B") {
                return Promise.resolve({
                    data: {
                        project: {
                            _id: "project-B",
                            name: "Test Project B",
                            description: "A test project for Project B",
                            owner: { _id: "user-123" },
                            members: [],
                        },
                    },
                });
            }

            if (url === "/projects/project-A/tasks") {
                return Promise.resolve({ data: { tasks: [] } });
            }

            if (url === "/projects/project-A/activities") {
                return Promise.resolve({ data: { activities: [] } });
            }

            if (url === "/projects/project-B/tasks") {
                return Promise.resolve({ data: { tasks: [] } });
            }

            if (url === "/projects/project-B/activities") {
                return Promise.resolve({ data: { activities: [] } });
            }

            throw new Error(`Unexpected API request: ${url}`);
        });

        mockRoute.projectId = "project-A";

        const { rerender } = render(<ProjectDetailsPage />);

        const generateButton = await screen.findByRole("button", {
            name: "Generate Summary",
        });

        await user.click(generateButton);

        // change mock route project id
        mockRoute.projectId = "project-B";

        rerender(<ProjectDetailsPage />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith(
                "/projects/project-B"
            );
        });

        await act(async () => {
            rejectProjectARequest({
                response: {
                    data: {
                        message: "Project A request failed",
                    },
                },
            });
        });

        expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    });
});