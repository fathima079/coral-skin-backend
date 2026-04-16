const Order = require("../models/orderModel");

const createOrder = async (req, res) => {
    try{
        const newOrder = new Order({
          ...req.body,
          user: req.user.id
        });
        const saved = await newOrder.save();

        res.status(201).json(saved);
    }catch (error) {
      console.error("FULL ERROR:", err);
      console.error("SERVER MESSAGE:", err.response?.data);
      alert("Failed to place order");
    }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { createOrder, getOrders, getOrderById };