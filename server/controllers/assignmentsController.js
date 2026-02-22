const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const { faculty_id, student_id, status } = req.query;
        const where = {};
        if (faculty_id) where.faculty_id = parseInt(faculty_id);
        if (student_id) where.student_id = parseInt(student_id);
        if (status) where.submission_status = status;

        const assignments = await prisma.assignments.findMany({
            where,
            include: {
                faculty: { select: { designation: true, user: { select: { username: true } } } },
                student: { select: { first_name: true, last_name: true } },
            },
            orderBy: { due_date: "desc" },
        });
        res.json({ success: true, count: assignments.length, data: assignments });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const assignment = await prisma.assignments.findUnique({
            where: { assignment_id: parseInt(req.params.id) },
            include: { faculty: true, student: true },
        });
        if (!assignment) return res.status(404).json({ success: false, error: "Assignment not found" });
        res.json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const assignment = await prisma.assignments.create({ data: req.body });
        res.status(201).json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const assignment = await prisma.assignments.update({
            where: { assignment_id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: assignment });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.assignments.delete({ where: { assignment_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, remove };
