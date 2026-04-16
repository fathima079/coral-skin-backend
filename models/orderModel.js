const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

    customerName: String,
    email: String,
    address: String,

    items: [
        {
            productId: String,
            name: String,
            price: Number,
            quantity: Number,
            image: String
        }
    ],

    totalAmount: Number,
    
    paymentMethod: {
        type: String,
        enum: ["card", "cod"]
    },

    status: {
        type: String,
        default: "Pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);