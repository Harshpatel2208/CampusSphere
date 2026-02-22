const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const { user_id, status } = req.query;
        const where = {};
        if (user_id) where.user_id = parseInt(user_id);
        if (status) where.status = status;

        const requests = await prisma.leave_Requests.findMany({
            where,
            include: { user: { select: { username: true, role: true } } },
            orderBy: { start_date: "desc" },
        });
        res.json({ success: true, count: requests.length, data: requests });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const request = await prisma.leave_Requests.findUnique({
            where: { leave_id: parseInt(req.params.id) },
            include: { user: { select: { username: true, role: true } } },
        });
        if (!request) return res.status(404).json({ success: false, error: "Leave request not found" });
        res.json({ success: true, data: request });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const request = await prisma.leave_Requests.create({ data: req.body });
        res.status(201).json({ success: true, data: request });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const request = await prisma.leave_Requests.update({
            where: { leave_id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: request });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.leave_Requests.delete({ where: { leave_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, remove };
