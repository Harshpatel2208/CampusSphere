const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const { student_id, date, status } = req.query;
        const where = {};
        if (student_id) where.student_id = parseInt(student_id);
        if (date) where.date = new Date(date);
        if (status) where.status = status;

        const attendance = await prisma.attendance.findMany({
            where,
            include: { student: { select: { first_name: true, last_name: true } } },
            orderBy: { date: "desc" },
        });
        res.json({ success: true, count: attendance.length, data: attendance });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const record = await prisma.attendance.findUnique({
            where: { attendance_id: parseInt(req.params.id) },
            include: { student: true },
        });
        if (!record) return res.status(404).json({ success: false, error: "Attendance record not found" });
        res.json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const record = await prisma.attendance.create({ data: req.body });
        res.status(201).json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

// Bulk create attendance for a class
const bulkCreate = async (req, res, next) => {
    try {
        const { records } = req.body; // [{ student_id, date, status }, ...]
        const created = await prisma.attendance.createMany({ data: records });
        res.status(201).json({ success: true, count: created.count });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const record = await prisma.attendance.update({
            where: { attendance_id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.attendance.delete({ where: { attendance_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, bulkCreate, update, remove };
