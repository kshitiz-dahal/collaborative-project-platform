const express = require("express");
const authenticate = require("../middleware/auth.middleware");

const {
    register,
    login,
    me,
} = require("../controllers/auth.controller");

const validateRegistration = require("../middleware/validateRegistration");
const validateLogin = require("../middleware/validateLogin");

const router = express.Router();

router.post(
    "/register",
    validateRegistration,
    register
);

router.post(
    "/login",
    validateLogin,
    login
);

router.get(
    "/me",
    authenticate,
    me
);

module.exports = router;