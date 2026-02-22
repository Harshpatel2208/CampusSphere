const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const { student_id } = req.query;
        const where = {};
        if (student_id) where.student_id = parseInt(student_id);

        const results = await prisma.results.findMany({
            where,
            include: { student: { select: { first_name: true, last_name: true } } },
        });
        res.json({ success: true, count: results.length, data: results });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const result = await prisma.results.findUnique({
            where: { result_id: parseInt(req.params.id) },
            include: { student: true },
        });
        if (!result) return res.status(404).json({ success: false, error: "Result not found" });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const result = await prisma.results.create({ data: req.body });
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const result = await prisma.results.update({
            where: { result_id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.results.delete({ where: { result_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, remove };
