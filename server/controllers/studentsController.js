const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const students = await prisma.students.findMany({
            include: { user: { select: { username: true, email: true, role: true } }, parent: true, division: true },
        });
        res.json({ success: true, count: students.length, data: students });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const student = await prisma.students.findUnique({
            where: { student_id: parseInt(req.params.id) },
            include: { user: { select: { username: true, email: true, role: true } }, parent: true, division: true, attendance: true, fees: true, results: true, assignments: true, mentoring: true },
        });
        if (!student) return res.status(404).json({ success: false, error: "Student not found" });
        res.json({ success: true, data: student });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const student = await prisma.students.create({ data: req.body });
        res.status(201).json({ success: true, data: student });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const student = await prisma.students.update({
            where: { student_id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: student });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.students.delete({ where: { student_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, remove };
