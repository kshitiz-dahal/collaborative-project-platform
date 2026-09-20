const { body, param } = require("express-validator");

const mongoId = /^[0-9a-fA-F]{24}$/;

const createTaskValidator = [
    param("projectId")
        .matches(mongoId)
        .withMessage("Invalid project ID"),
    
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required"),
    
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    
    body("status")
        .optional()
        .isIn(["todo", "in-progress", "completed"])
        .withMessage("Invalid task status"),
    
    body("priority")
        .optional().isIn(["low", "medium", "high"])
        .withMessage("Invalid task priority"),
    
    body("assignee").optional({ nullable: true })
        .matches(mongoId)
        .withMessage("Invalid assignee ID"),
    
    body("dueDate").optional({ nullable: true })
        .isISO8601()
        .withMessage("Due date must be a valid date"),
];

const projectIdValidator = [
    param("projectId").matches(mongoId).withMessage("Invalid project ID"),
];

const taskIdValidator = [
    param("taskId")
        .matches(mongoId)
        .withMessage("Invalid task ID"),
];

const updateTaskValidator = [
    param("taskId")
        .matches(mongoId)
        .withMessage("Invalid task ID"),
    
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty"),
    
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string"),
    
    body("status")
        .optional()
        .isIn(["todo", "in-progress", "completed"])
        .withMessage("Invalid task status"),
    
    body("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Invalid task priority"),
    
    body("assignee")
        .optional({ nullable: true })
        .matches(mongoId)
        .withMessage("Invalid assignee ID"),
    
    body("dueDate")
        .optional({ nullable: true })
        .isISO8601()
        .withMessage("Due date must be a valid date"),
];

module.exports = {
    createTaskValidator,
    projectIdValidator,
    taskIdValidator,
    updateTaskValidator,
};