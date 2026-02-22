const jwt = require("jsonwebtoken");
const prisma = require("../lib/prisma");

// Protect routes – verify JWT token
const protect = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, error: "Not authorized, no token" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.users.findUnique({
            where: { user_id: decoded.id },
            select: { user_id: true, username: true, email: true, role: true },
        });

        if (!user) {
            return res.status(401).json({ success: false, error: "User no longer exists" });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ success: false, error: "Not authorized, token invalid" });
    }
};

// Restrict to specific roles
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: `Role '${req.user.role}' is not authorized to access this route`,
            });
        }
        next();
    };
};

module.exports = { protect, authorize };
