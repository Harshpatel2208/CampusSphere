const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc    Register a new user
// @route   POST /api/auth/register
const register = async (req, res, next) => {
    try {
        const { username, password, email, role } = req.body;

        if (!username || !password || !role) {
            return res.status(400).json({ success: false, error: "Please provide username, password, and role" });
        }

        // Check if user already exists
        const existingUser = await prisma.users.findFirst({
            where: { OR: [{ username }, ...(email ? [{ email }] : [])] },
        });

        if (existingUser) {
            return res.status(400).json({ success: false, error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const user = await prisma.users.create({
            data: { username, password_hash, email: email || null, role },
        });

        const token = generateToken(user.user_id, user.role);

        res.status(201).json({
            success: true,
            data: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: "Please provide username and password" });
        }

        const user = await prisma.users.findUnique({ where: { username } });

        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Invalid credentials" });
        }

        const token = generateToken(user.user_id, user.role);

        res.json({
            success: true,
            data: {
                user_id: user.user_id,
                username: user.username,
                email: user.email,
                role: user.role,
                token,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged-in user
// @route   GET /api/auth/me
const getMe = async (req, res, next) => {
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: req.user.user_id },
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                created_at: true,
                student: true,
                faculty: true,
            },
        });

        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

module.exports = { register, login, getMe };
