require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected Successfully");
    }
    catch (error){
        console.error("DB Connection failed:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;