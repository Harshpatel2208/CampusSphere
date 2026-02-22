const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const { faculty_id, student_id } = req.query;
        const where = {};
        if (faculty_id) where.faculty_id = parseInt(faculty_id);
        if (student_id) where.student_id = parseInt(student_id);

        const mentoring = await prisma.mentoring.findMany({
            where,
            include: {
                faculty: { select: { designation: true, user: { select: { username: true } } } },
                student: { select: { first_name: true, last_name: true } },
            },
            orderBy: { meeting_date: "desc" },
        });
        res.json({ success: true, count: mentoring.length, data: mentoring });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const record = await prisma.mentoring.findUnique({
            where: { mentoring_id: parseInt(req.params.id) },
            include: { faculty: true, student: true },
        });
        if (!record) return res.status(404).json({ success: false, error: "Mentoring record not found" });
        res.json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const record = await prisma.mentoring.create({ data: req.body });
        res.status(201).json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const record = await prisma.mentoring.update({
            where: { mentoring_id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.mentoring.delete({ where: { mentoring_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, remove };
