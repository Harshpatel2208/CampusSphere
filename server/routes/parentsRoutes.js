const express = require("express");
const router = express.Router();
const { getAll, getById, create, update, remove } = require("../controllers/parentsController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);

router.get("/", authorize("Admin", "Faculty"), getAll);
router.get("/:id", getById);
router.post("/", authorize("Admin"), create);
router.put("/:id", authorize("Admin"), update);
router.delete("/:id", authorize("Admin"), remove);

module.exports = router;
