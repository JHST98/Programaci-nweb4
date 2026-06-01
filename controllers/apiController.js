import Product from "../models/Product.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Inicializar categorías si la base de datos está vacía
export const seedCategories = async () => {
  try {
    const count = await Category.countDocuments();
    if (count === 0) {
      const categoriasDefault = ["Electrónica", "Ropa", "Hogar", "Alimentos", "Librería"];
      for (const name of categoriasDefault) {
        await Category.create({ name });
      }
      console.log("Categorías iniciales creadas con éxito.");
    }
  } catch (error) {
    console.error("Error al inicializar categorías:", error);
  }
};

// GET /api/categories
export const getCategories = async (req, res) => {
  try {
    await seedCategories(); // Garantiza que siempre haya categorías
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: "Error interno al obtener categorías" });
  }
};

// GET /api/products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("categoryId", "name")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error interno al obtener productos" });
  }
};

// GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Formato de ID inválido (400 Bad Request)" });
    }

    const product = await Product.findById(req.params.id).populate("categoryId", "name");
    if (!product) return res.status(404).json({ error: "Producto no encontrado (404 Not Found)" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor (500 Internal Server Error)" });
  }
};

// POST /api/products
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, categoryId, stock, imageUrl: bodyImageUrl } = req.body;
    let imageUrl = bodyImageUrl || "";
    if (req.file) imageUrl = `/uploads/${req.file.filename}`;

    const newProduct = new Product({
      name,
      price: Number(price),
      description: description || "",
      imageUrl,
      categoryId: categoryId && categoryId !== "null" && categoryId !== "" ? categoryId : undefined,
      stock: stock ? Number(stock) : 0
    });

    await newProduct.save();
    const populated = await Product.findById(newProduct._id).populate("categoryId", "name");

    if (req.io) req.io.emit("producto_creado", populated);
    res.status(201).json(populated);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error(error);
    res.status(500).json({ error: "Error interno al crear el producto (500 Internal Server Error)" });
  }
};

// PUT/PATCH /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ error: "Formato de ID inválido (400 Bad Request)" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ error: "Producto no encontrado (404 Not Found)" });
    }

    const { name, price, description, categoryId, stock, imageUrl: bodyImageUrl } = req.body;
    if (name) product.name = name;
    if (price !== undefined) product.price = Number(price);
    if (description !== undefined) product.description = description;
    if (stock !== undefined) product.stock = Number(stock);
    if (categoryId !== undefined) {
      product.categoryId = categoryId && categoryId !== "null" && categoryId !== "" ? categoryId : undefined;
    }
    if (bodyImageUrl !== undefined && !req.file) {
      product.imageUrl = bodyImageUrl;
    }

    if (req.file) {
      if (product.imageUrl && product.imageUrl.startsWith("/uploads/")) {
        const oldPath = path.join(process.cwd(), product.imageUrl);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      product.imageUrl = `/uploads/${req.file.filename}`;
    }

    await product.save();
    const populated = await Product.findById(product._id).populate("categoryId", "name");

    if (req.io) req.io.emit("producto_actualizado", populated);
    res.json(populated);
  } catch (error) {
    if (req.file) fs.unlinkSync(req.file.path);
    console.error(error);
    res.status(500).json({ error: "Error interno al actualizar el producto (500 Internal Server Error)" });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Formato de ID inválido (400 Bad Request)" });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: "Producto no encontrado (404 Not Found)" });

    if (product.imageUrl) {
      const imagePath = path.join(process.cwd(), product.imageUrl);
      if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    }

    await Product.findByIdAndDelete(req.params.id);
    if (req.io) req.io.emit("producto_eliminado", { id: req.params.id });
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno al eliminar el producto (500 Internal Server Error)" });
  }
};
