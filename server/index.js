require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandler");

// Route imports
const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/usersRoutes");
const studentsRoutes = require("./routes/studentsRoutes");
const facultyRoutes = require("./routes/facultyRoutes");
const parentsRoutes = require("./routes/parentsRoutes");
const divisionsRoutes = require("./routes/divisionsRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const assignmentsRoutes = require("./routes/assignmentsRoutes");
const feesRoutes = require("./routes/feesRoutes");
const resultsRoutes = require("./routes/resultsRoutes");
const mentoringRoutes = require("./routes/mentoringRoutes");
const messagesRoutes = require("./routes/messagesRoutes");
const leaveRequestsRoutes = require("./routes/leaveRequestsRoutes");
const seatingRoutes = require("./routes/seatingRoutes");
const timetableRoutes = require("./routes/timetableRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/students", studentsRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/parents", parentsRoutes);
app.use("/api/divisions", divisionsRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/mentoring", mentoringRoutes);
app.use("/api/messages", messagesRoutes);
app.use("/api/leave-requests", leaveRequestsRoutes);
app.use("/api/seating", seatingRoutes);
app.use("/api/timetable", timetableRoutes);

// Error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
