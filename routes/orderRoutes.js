const express = require("express");
const { createOrder, getOrders, getOrderById } = require("../controllers/orderControllers");
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();

router.post("/", protect, createOrder);
router.get("/", protect, adminOnly, getOrders);
router.get("/:id", protect, getOrderById);


module.exports = router;