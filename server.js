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
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
}));
app.use(express.json());


app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);

app.listen(port, () => {
    console.log(`This server listens to port ${port}`);
    
})