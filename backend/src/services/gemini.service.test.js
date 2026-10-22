const { generateProjectSummary } = require("./gemini.service");

describe("generateProjectSummary", () => {
    const originalApiKey = process.env.GEMINI_API_KEY;
    const originalFetch = global.fetch;

    afterEach(() => {
        global.fetch = originalFetch;
        if (originalApiKey === undefined) {
            delete process.env.GEMINI_API_KEY;
        } else {
            process.env.GEMINI_API_KEY = originalApiKey;
        }

        jest.restoreAllMocks();
    });

    test("throws when the API key is missing", async () => {
        delete process.env.GEMINI_API_KEY;

        const fetchSpy = jest.spyOn(global, "fetch");

        await expect(
            generateProjectSummary({})
        ).rejects.toThrow("GEMINI_API_KEY is not configured");

        expect(fetchSpy).not.toHaveBeenCalled();
    });

    test("returns the generated summary on success", async () => {
        process.env.GEMINI_API_KEY = "test-api-key";

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                status: "completed",
                steps: [
                    {
                        type: "model_output",
                        content: [
                            {
                                type: "text",
                                text: "The project is processing well."
                            }
                        ]
                    }
                ]
            })
        });

        const summary = await generateProjectSummary({
            project: { name: "Test Project" },
            stats: { total: 5 }
        });

        expect(summary).toBe("The project is processing well.");
        expect(global.fetch).toHaveBeenCalledTimes(1);

        const [url, options] = global.fetch.mock.calls[0];

        expect(url).toContain("/v1beta/interactions");
        expect(options.method).toBe("POST");
        expect(options.headers["x-goog-api-key"]).toBe("test-api-key");
    });

    test("throws when Gemini returns an unsuccessful HTTP response", async () => {
        process.env.GEMINI_API_KEY = "test-api-key";

        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 502,
            text: async () => "Gemini API request failed:",
        });

        await expect(
            generateProjectSummary({ project: { name: "Test Project" } })
        ).rejects.toThrow("Gemini API request failed: 502");

        expect(global.fetch).toHaveBeenCalledTimes(1);
    });

    test("throws when Gemini response is not completed", async () => {
        process.env.GEMINI_API_KEY = "test-api-key";

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                status: "in-progress",
                steps: []
            })
        });

        await expect(
            generateProjectSummary({ project: { name: "Test Project" } })
        ).rejects.toThrow(
            "Unable to generate project summary"
        );
    });

    test("throws when Gemini returns no text summary", async () => {
        process.env.GEMINI_API_KEY = "test-api-key";

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                status: "completed",
                steps: []
            })
        });

        await expect(
            generateProjectSummary({ project: { name: "Test Project" } })
        ).rejects.toThrow(
            "Unable to generate project summary"
        );
    });

    test("throws when Gemini returns whitespace-only summary text", async () => {
        process.env.GEMINI_API_KEY = "test-api-key";

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                status: "completed",
                steps: [
                    {
                        type: "model_output",
                        content: [
                            {
                                type: "text",
                                text: "  \n ",
                            },
                        ],
                    },
                ],
            }),
        });

        await expect(
            generateProjectSummary({
                project: { name: "Test Project" },
            })
        ).rejects.toThrow("Unable to generate project summary");
    });

    test("throws when unexpected response structure is returned", async () => {
        process.env.GEMINI_API_KEY = "test-api-key";

        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                status: "completed",
            }),
        });

        await expect(
            generateProjectSummary({
                project: { name: "Test Project" },
            })
        ).rejects.toThrow("Unable to generate project summary");
    });

    test("throws when the Gemini API request fails due to a network error", async () => {
        process.env.GEMINI_API_KEY = "test-api-key";

        global.fetch = jest.fn().mockRejectedValue(
            new Error("Network unavailable")
        );

        await expect(
            generateProjectSummary({
                project: { name: "Test Project" },
            })
        ).rejects.toThrow("Network unavailable");

        expect(global.fetch).toHaveBeenCalledTimes(1);
    });
});