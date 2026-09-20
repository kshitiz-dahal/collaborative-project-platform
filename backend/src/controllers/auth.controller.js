const {
    registerUser,
    loginUser,
    getCurrentUser,
} = require("../services/auth.service");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await registerUser({
            name,
            email,
            password,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user,
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await loginUser({
            email,
            password,
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            ...result,
        });
    } catch (error) {
        res.status(401).json({
            success: false,
            message: error.message,
        });
    }
};

const me = async (req, res) => {
    try {
        const user = await getCurrentUser(req.user.id);

        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    register,
    login,
    me,
};