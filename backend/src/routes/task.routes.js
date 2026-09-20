const express = require("express");

const router = express.Router();

const validate = require("../middleware/validation.middleware");
const authenticate = require("../middleware/auth.middleware");

const {
    createTaskValidator,
    taskIdValidator,
    updateTaskValidator,
    projectIdValidator,
} = require("../validators/task.validator");

const {
    create,
    getTasks,
    getById,
    update,
    remove
} = require("../controllers/task.controller");

router.post(
    "/projects/:projectId/tasks",
    authenticate,
    createTaskValidator,
    validate,
    create
);

router.get(
    "/projects/:projectId/tasks",
    authenticate,
    projectIdValidator,
    validate,
    getTasks
);

router.get(
    "/tasks/:taskId",
    authenticate,
    taskIdValidator,
    validate,
    getById
);

router.put(
    "/projects/:projectId/tasks/:taskId",
    authenticate,
    updateTaskValidator,
    validate,
    update
);

router.delete(
    "/projects/:projectId/tasks/:taskId",
    authenticate,
    taskIdValidator,
    validate,
    remove
);

module.exports = router;