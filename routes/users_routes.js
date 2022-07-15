const express = require("express");
const { registerUser, loginUser,getMe } = require("../controllers/user_controller");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", registerUser);
router.post("/", loginUser);
router.get("/me", protect, getMe);

module.exports = router;
