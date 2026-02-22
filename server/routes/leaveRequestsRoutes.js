const express = require("express");
const router = express.Router();
const { getAll, getById, create, update, remove } = require("../controllers/leaveRequestsController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", create);
router.put("/:id", authorize("Admin", "Faculty"), update); // Only admin/faculty can approve/reject
router.delete("/:id", authorize("Admin"), remove);

module.exports = router;
