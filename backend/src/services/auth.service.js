const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

const registerUser = async ({ name, email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    if (existingUser) {
        throw new Error("User with this email already exists");
    }

    // password hashing here
    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
        name,
        email: normalizedEmail,
        passwordHash,
    });

    return {
        id: user._id,
        name: user.name,
        email: user.email,
    };
};

const loginUser = async ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
        email: normalizedEmail,
    });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(
        password,
        user.passwordHash
    );

    if (!passwordMatches) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id.toString());

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        },
    };
};

const getCurrentUser = async (userId) => {
    const user = await User.findById(userId).select(
        "_id name email createdAt updatedAt"
    );

    if (!user) {
        throw new Error("User not found");
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

module.exports = {
    registerUser,
    loginUser,
    getCurrentUser,
};