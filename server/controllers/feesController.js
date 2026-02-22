const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const { student_id, payment_status } = req.query;
        const where = {};
        if (student_id) where.student_id = parseInt(student_id);
        if (payment_status) where.payment_status = payment_status;

        const fees = await prisma.fees.findMany({
            where,
            include: { student: { select: { first_name: true, last_name: true } } },
        });
        res.json({ success: true, count: fees.length, data: fees });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const fee = await prisma.fees.findUnique({
            where: { fee_id: parseInt(req.params.id) },
            include: { student: true },
        });
        if (!fee) return res.status(404).json({ success: false, error: "Fee record not found" });
        res.json({ success: true, data: fee });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const fee = await prisma.fees.create({ data: req.body });
        res.status(201).json({ success: true, data: fee });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const fee = await prisma.fees.update({
            where: { fee_id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: fee });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.fees.delete({ where: { fee_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, remove };
