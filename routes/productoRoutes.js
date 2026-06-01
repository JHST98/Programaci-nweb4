import express from "express";
import { upload } from "../middlewares/upload.js";
import { validarProducto, validarProduct } from "../middlewares/validation.js";
import { isAuthenticated } from "../middlewares/auth.js";
import {
  mostrarVistaProductos,
  crearProducto,
  obtenerProductos,
  obtenerProducto,
  actualizarProducto,
  eliminarProducto
} from "../controllers/productoController.js";
import {
  getCategories,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controllers/apiController.js";

const router = express.Router();

// Vistas
router.get("/productos", isAuthenticated, mostrarVistaProductos);

// --- RUTAS LEGACY (Español) ---
router.post("/api/productos", isAuthenticated, upload.single("imagen"), validarProducto, crearProducto);
router.get("/api/productos", isAuthenticated, obtenerProductos);
router.get("/api/productos/:id", isAuthenticated, obtenerProducto);
router.put("/api/productos/:id", isAuthenticated, upload.single("imagen"), validarProducto, actualizarProducto);
router.delete("/api/productos/:id", isAuthenticated, eliminarProducto);

// --- NUEVAS RUTAS API REST (Inglés) ---
router.get("/api/categories", getCategories);

router.get("/api/products", getProducts);
router.get("/api/products/:id", getProductById);
router.post("/api/products", upload.single("imageUrl"), validarProduct, createProduct);
router.put("/api/products/:id", upload.single("imageUrl"), validarProduct, updateProduct);
router.patch("/api/products/:id", upload.single("imageUrl"), validarProduct, updateProduct);
router.delete("/api/products/:id", deleteProduct);

export default router;