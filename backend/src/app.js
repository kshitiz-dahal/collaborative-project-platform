const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");

const activityRoutes = require("./routes/activity.routes");

const notificationRoutes = require("./routes/notification.routes");

const commentRoutes = require("./routes/comment.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Collaborative Project Platform API is running"
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", taskRoutes);

app.use("/api", activityRoutes);

app.use("/api", notificationRoutes);

app.use("/api", commentRoutes);

module.exports = app;