const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const faculty = await prisma.faculty.findMany({
            include: { user: { select: { username: true, email: true, role: true } } },
        });
        res.json({ success: true, count: faculty.length, data: faculty });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const faculty = await prisma.faculty.findUnique({
            where: { faculty_id: parseInt(req.params.id) },
            include: { user: { select: { username: true, email: true, role: true } }, divisions: true, assignments: true, mentoring: true, timetable: true },
        });
        if (!faculty) return res.status(404).json({ success: false, error: "Faculty not found" });
        res.json({ success: true, data: faculty });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const faculty = await prisma.faculty.create({ data: req.body });
        res.status(201).json({ success: true, data: faculty });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const faculty = await prisma.faculty.update({
            where: { faculty_id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: faculty });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.faculty.delete({ where: { faculty_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, remove };
