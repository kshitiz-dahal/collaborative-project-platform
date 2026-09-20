const express = require("express");

const {
    getActivities,
} = require("../controllers/activity.controller");

const authenticate = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
    "/projects/:projectId/activities",
    authenticate,
    getActivities,
);

module.exports = router;