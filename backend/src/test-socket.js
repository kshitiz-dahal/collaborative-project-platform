const { io } = require("socket.io-client");

require("dotenv").config();

const loginAndConnect = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: process.env.TEST_EMAIL,
                password: process.env.TEST_PASSWORD,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Login failed");
        }

        const token = data.token;

        const socket = io("http://localhost:5000", {
            auth: {
                token,
            },
        });

        socket.on("connect", () => {
            console.log("Connected to Socket.IO server");
            console.log("Socket ID:", socket.id);

            socket.emit(
                "join-project",
                {
                    projectId: process.env.TEST_PROJECT_ID,
                },
                (result) => {
                    console.log("Join response:", result);
                }
            );
        });

        socket.on("member-added", (data) => {
            console.log("\nREAL-TIME MEMBER ADDED!");
            console.log(data);
        });

        socket.on("member-removed", (data) => {
            console.log("\nREAL-TIME MEMBER REMOVED!");
            console.log(data);
        });

        socket.on("task-created", (task) => {
            console.log("\nREAL-TIME TASK CREATED!");
            console.log("Task:", task);
        });

        socket.on("task-updated", (task) => {
            console.log("\nREAL-TIME TASK UPDATED!");
            console.log("Task:", task);
        });

        socket.on("task-deleted", (data) => {
            console.log("\nREAL-TIME TASK DELETED!");
            console.log(data);
        });

        socket.on("connect_error", (error) => {
            console.log("Connection error:", error.message);
        });
    } catch (error) {
        console.error("Socket test failed:", error.message);
    }
};

loginAndConnect();