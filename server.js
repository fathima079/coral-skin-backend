require("dotenv").config()
const express = require("express");
const connectDB = require("./database/db");
const productRoutes = require("./routes/productRoutes")
const orderRoutes = require("./routes/orderRoutes")
const authRoutes = require("./routes/authRoutes")
const cors = require("cors")
const app = express();

connectDB();
const port = process.env.PORT || 5808;

app.use(cors({
  origin: /https:\/\/.*\.vercel\.app$/,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`This server listens to port ${port}`);
    
})