const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

  // Basic info
  name: { type: String, required: true },
  brand: { type: String, required: true },

  category: {
    type: String,
    enum: ["cleanser", "serum", "moisturizer", "sunscreen", "toner", "mask"],
    required: true
  },

  price: { type: Number, required: true },
  discountPrice: { type: Number },

  // Variants (sizes)
  variants: [
    {
      size: String,   // 30ml / 50ml
      price: Number,
      stock: Number
    }
  ],

  // Skin compatibility
  skinType: [{
    type: String,
    enum: ["dry", "oily", "combination", "sensitive", "normal"]
  }],

  concerns: [{
    type: String,
    enum: ["acne", "aging", "pigmentation", "hydration", "dullness"]
  }],

  // Product details
  ingredients: [String],
  benefits: [String],
  howToUse: String,
  description: String,

  // Images
  images: [String],

  // Stock
  stock: { type: Number, default: 0 },

  // Reviews summary
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },

  // Product tags
  isFeatured: { type: Boolean, default: false },
  isNew: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);
