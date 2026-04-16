const express = require("express")
const { getAllProducts, addProducts, updateProduct, deleteProduct, getProductById } = require("../controllers/productController")

const router = express.Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById)
router.post("/", addProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct)

module.exports = router;