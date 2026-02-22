const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const parents = await prisma.parents.findMany({ include: { students: true } });
        res.json({ success: true, count: parents.length, data: parents });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const parent = await prisma.parents.findUnique({
            where: { parent_id: parseInt(req.params.id) },
            include: { students: true },
        });
        if (!parent) return res.status(404).json({ success: false, error: "Parent not found" });
        res.json({ success: true, data: parent });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const parent = await prisma.parents.create({ data: req.body });
        res.status(201).json({ success: true, data: parent });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const parent = await prisma.parents.update({
            where: { parent_id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: parent });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.parents.delete({ where: { parent_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, remove };
