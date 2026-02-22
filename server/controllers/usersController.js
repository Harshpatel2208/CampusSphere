const prisma = require("../lib/prisma");

// @desc    Get all users
// @route   GET /api/users
const getAll = async (req, res, next) => {
    try {
        const users = await prisma.users.findMany({
            select: {
                user_id: true,
                username: true,
                email: true,
                role: true,
                created_at: true,
            },
        });
        res.json({ success: true, count: users.length, data: users });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
const getById = async (req, res, next) => {
    try {
        const user = await prisma.users.findUnique({
            where: { user_id: parseInt(req.params.id) },
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
        if (!user) return res.status(404).json({ success: false, error: "User not found" });
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update user
// @route   PUT /api/users/:id
const update = async (req, res, next) => {
    try {
        const { username, email, role } = req.body;
        const user = await prisma.users.update({
            where: { user_id: parseInt(req.params.id) },
            data: { ...(username && { username }), ...(email && { email }), ...(role && { role }) },
        });
        res.json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
const remove = async (req, res, next) => {
    try {
        await prisma.users.delete({ where: { user_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, update, remove };
