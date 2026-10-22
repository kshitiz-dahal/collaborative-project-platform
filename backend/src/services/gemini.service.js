const generateProjectSummary = async (context) => {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const endpoint = "https://generativelanguage.googleapis.com/v1beta/interactions";

    const payload = {
        model: "gemini-3.8-flash",
        input: `Summarize this project for its team.

        Project context: ${JSON.stringify(context)}

        Return a concise summary covering:
        1. Overall project progress
        2. Important task-status patterns
        3. Potential risks or blockers
        4. Suggested next steps

        Use only the supplied data. Do not invent facts.`,
        store: false
    };

    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": process.env.GEMINI_API_KEY
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Gemini API request failed:", {
            status: response.status,
            body: errorBody,
        });

        const error = new Error(`Gemini API request failed: ${response.status}`);
        error.statusCode = 502;
        throw error;
    }

    const result = await response.json();

    const summary = (Array.isArray(result.steps) ? result.steps : [])
        .filter(step => step.type === "model_output")
        .flatMap(step => step.content ?? [])
        .filter(
            part => part.type === "text" && 
                typeof part.text === "string"
        )
        .map(part => part.text)
        .join("\n")
        .trim();
    
    if (result.status !== "completed" || !summary) {
        const error = new Error("Unable to generate project summary");
        error.statusCode = 502;
        throw error;
    }

    return summary;
};

module.exports = { generateProjectSummary };