const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const { sender_id, receiver_id } = req.query;
        const where = {};
        if (sender_id) where.sender_id = parseInt(sender_id);
        if (receiver_id) where.receiver_id = parseInt(receiver_id);

        const messages = await prisma.messages.findMany({
            where,
            include: {
                sender: { select: { username: true, role: true } },
                receiver: { select: { username: true, role: true } },
            },
            orderBy: { sent_at: "desc" },
        });
        res.json({ success: true, count: messages.length, data: messages });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const message = await prisma.messages.findUnique({
            where: { message_id: parseInt(req.params.id) },
            include: { sender: { select: { username: true } }, receiver: { select: { username: true } } },
        });
        if (!message) return res.status(404).json({ success: false, error: "Message not found" });
        res.json({ success: true, data: message });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const message = await prisma.messages.create({ data: req.body });
        res.status(201).json({ success: true, data: message });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.messages.delete({ where: { message_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, remove };
