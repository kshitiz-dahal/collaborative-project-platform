const express = require("express");

const {
    create,
    getMyProjects,
    getById,
    update,
    remove,
    addProjectMember,
    removeProjectMember,
} = require("../controllers/project.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/", authenticate, create);
router.get("/", authenticate, getMyProjects);
router.get("/:projectId", authenticate, getById);
router.put("/:projectId", authenticate, update);
router.delete("/:projectId", authenticate, remove);
router.post("/:projectId/members", authenticate, addProjectMember);
router.delete(
    "/:projectId/members/:userId",
    authenticate,
    removeProjectMember
);

module.exports = router;