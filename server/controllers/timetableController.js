const prisma = require("../lib/prisma");

const getAll = async (req, res, next) => {
    try {
        const { division_id, faculty_id, day_of_week } = req.query;
        const where = {};
        if (division_id) where.division_id = parseInt(division_id);
        if (faculty_id) where.faculty_id = parseInt(faculty_id);
        if (day_of_week) where.day_of_week = day_of_week;

        const timetable = await prisma.timetable.findMany({
            where,
            include: {
                division: { select: { division_name: true } },
                faculty: { select: { designation: true, user: { select: { username: true } } } },
            },
            orderBy: [{ day_of_week: "asc" }, { start_time: "asc" }],
        });
        res.json({ success: true, count: timetable.length, data: timetable });
    } catch (error) {
        next(error);
    }
};

const getById = async (req, res, next) => {
    try {
        const entry = await prisma.timetable.findUnique({
            where: { timetable_id: parseInt(req.params.id) },
            include: { division: true, faculty: true },
        });
        if (!entry) return res.status(404).json({ success: false, error: "Timetable entry not found" });
        res.json({ success: true, data: entry });
    } catch (error) {
        next(error);
    }
};

const create = async (req, res, next) => {
    try {
        const entry = await prisma.timetable.create({ data: req.body });
        res.status(201).json({ success: true, data: entry });
    } catch (error) {
        next(error);
    }
};

const update = async (req, res, next) => {
    try {
        const entry = await prisma.timetable.update({
            where: { timetable_id: parseInt(req.params.id) },
            data: req.body,
        });
        res.json({ success: true, data: entry });
    } catch (error) {
        next(error);
    }
};

const remove = async (req, res, next) => {
    try {
        await prisma.timetable.delete({ where: { timetable_id: parseInt(req.params.id) } });
        res.json({ success: true, data: {} });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, create, update, remove };
