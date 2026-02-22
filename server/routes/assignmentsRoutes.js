const express = require("express");
const router = express.Router();
const { getAll, getById, create, update, remove } = require("../controllers/assignmentsController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", getAll);
router.get("/:id", getById);
router.post("/", authorize("Admin", "Faculty"), create);
router.put("/:id", authorize("Admin", "Faculty"), update);
router.delete("/:id", authorize("Admin", "Faculty"), remove);

module.exports = router;
