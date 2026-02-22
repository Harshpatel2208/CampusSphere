const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const { student_id, exam_name } = req.query;
        const where = {};
        if (student_id) where.student_id = parseInt(student_id);
        if (exam_name) where.exam_name = exam_name;

        const seating = await prisma.seating_Arrangement.findMany({
            where,
            include: { student: { select: { first_name: true, last_name: true } } },
        });
        res.json({ success: true, count: seating.length, data: seating });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const record = await prisma.seating_Arrangement.findUnique({
            where: { seating_id: parseInt(req.params.id) },
            include: { student: true },
        });
        if (!record) return res.status(404).json({ success: false, error: "Seating record not found" });
        res.json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const record = await prisma.seating_Arrangement.create({ data: req.body });
        res.status(201).json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const record = await prisma.seating_Arrangement.update({
            where: { seating_id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.seating_Arrangement.delete({ where: { seating_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, remove };
