const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Project = require("./models/Project");

const initializeSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
        },
    });

    // socket authentication middleware - understand this better
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth.token;

            if (!token) {
                return next(new Error("Authentication token is required"));
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.userId).select(
                "-passwordHash"
            );

            if (!user) {
                return next(new Error("User not found"));
            }

            socket.user = user;

            next();
        } catch (error) {
            next(new Error("Socket authentication failed"));
        }
    });

    io.on("connection", (socket) => {
        const userRoom = `user:${socket.user._id.toString()}`;

        socket.join(userRoom);

        console.log(`User ${socket.user.email} joined personal room ${userRoom}`);
        
        socket.on("join-project", async ({ projectId }, callback) => {
            const respond = (data) => {
                if (typeof callback === "function") {
                    callback(data);
                }
            };

            try {
                const project = await Project.findById(projectId);

                if (!project) {
                    return respond({
                        success: false,
                        message: "Project not found",
                    });
                }

                const isMember = project.members.some(
                    (memberId) => memberId.toString() === socket.user._id.toString()
                );

                if (!isMember) {
                    return respond({
                        success: false,
                        message: "You are not a member of this project",
                    });
                }

                const roomName = `project:${projectId}`;

                socket.join(roomName);

                console.log(
                    `User ${socket.user.email} joined room ${roomName}`
                );

                respond({
                    success: true,
                    message: "Joined project room successfully",
                    room: roomName,
                });
            } catch (error) {
                respond({
                    success: false,
                    message: "Failed to join project room",
                });
            }
        });

        console.log(
            `Socket connected: ${socket.id}, User: ${socket.user.email}`
        );

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
        });
    });

    return io;
};

module.exports = initializeSocket;