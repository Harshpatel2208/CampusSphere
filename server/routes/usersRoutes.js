const express = require("express");
const router = express.Router();
const { getAll, getById, update, remove } = require("../controllers/usersController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect); // All user routes are protected

router.get("/", authorize("Admin"), getAll);
router.get("/:id", getById);
router.put("/:id", update);
router.delete("/:id", authorize("Admin"), remove);

module.exports = router;
