const express = require("express");
const authenticate = require("../middleware/auth.middleware");
const {
    create,
    getByTask,
    update,
    remove
} = require("../controllers/comment.controller");

const router = express.Router();

router.post("/tasks/:taskId/comments", authenticate, create);
router.get("/tasks/:taskId/comments", authenticate, getByTask);
router.put("/comments/:commentId", authenticate, update);
router.delete("/comments/:commentId", authenticate, remove);

module.exports = router;