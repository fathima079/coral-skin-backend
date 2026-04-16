const product = require("../models/productSchema")

const getAllProducts = async (req, res) => {
    try{
        const Allproducts = await product.find();
        res.status(200).json(Allproducts);
    }
    catch (error){
        console.error("Controller error:", error);
        res.status(500).json({
        message: "Server error",
    });
    }
}

const getProductById = async (req, res) => {
    try{
        const singleproduct = await product.findById(req.params.id);
        
        if(!singleproduct){
            return res.status(404).json({message: "Product not found"})
        }

        res.status(200).json(singleproduct);
    }
    catch (error){
        console.error("Controller error:", error);
        res.status(500).json({
        message: "Server error",
    });
    }
}

const addProducts = async (req, res) => {
    try{
        const newProduct = new product(req.body);
        const saved = await newProduct.save();

        res.status(200).json(saved);
    }
    catch (error){
        console.error("SAVE ERROR", error);
        res.status(500).json({message: error.message});
    }
}

const updateProduct = async (req, res) => {
    try{
        const updated = await product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!updated){
            return res.status(404).json({message: "Product not found"})
        }

        res.status(201).json(updated)
    }
    catch (error){
        console.error("UPDATE ERROR:", error);
        res.status(500).json({message: error.message});
    }
}

const deleteProduct = async (req, res) => {
    try{
        const deleted = await product.findByIdAndDelete(req.params.id);

        if(!deleted){
           return res.status(404).json({message: "Product not found"})
        }

        res.status(200).json({message: "Product deleted successfully"})
    }
    catch (error){
        console.error("DELETE ERROR:", error);
        res.status(500).json({message: error.message});
    }
}

module.exports = { getAllProducts, getProductById, addProducts, updateProduct, deleteProduct }