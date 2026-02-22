const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const divisions = await prisma.divisions.findMany({
            include: { faculty: { include: { user: { select: { username: true } } } }, students: true },
        });
        res.json({ success: true, count: divisions.length, data: divisions });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const division = await prisma.divisions.findUnique({
            where: { division_id: parseInt(req.params.id) },
            include: { faculty: true, students: true, timetable: true },
        });
        if (!division) return res.status(404).json({ success: false, error: "Division not found" });
        res.json({ success: true, data: division });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const division = await prisma.divisions.create({ data: req.body });
        res.status(201).json({ success: true, data: division });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const division = await prisma.divisions.update({
            where: { division_id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: division });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.divisions.delete({ where: { division_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, remove };
