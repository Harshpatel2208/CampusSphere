const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // Prisma known request error
    if (err.code && err.code.startsWith("P")) {
        const prismaErrors = {
            P2002: { status: 409, message: "A record with that unique field already exists." },
            P2025: { status: 404, message: "Record not found." },
            P2003: { status: 400, message: "Foreign key constraint failed." },
            P2014: { status: 400, message: "Invalid relation data provided." },
        };

        const mapped = prismaErrors[err.code];
        if (mapped) {
            return res.status(mapped.status).json({ success: false, error: mapped.message });
        }
    }

    // Custom API error with statusCode
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({ success: false, error: message });
};

module.exports = errorHandler;
