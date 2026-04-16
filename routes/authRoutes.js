const { register, login, getProfile, forgotPassword, resetPassword, logout } = require("../controllers/authController");
const protect = require("../middleware/authMiddleware");

const router = require("express").Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/profile", protect, getProfile);

module.exports = router;