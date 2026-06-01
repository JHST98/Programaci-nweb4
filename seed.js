import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "./models/Category.js";
import Product from "./models/Product.js";

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/inventario_db";
    await mongoose.connect(mongoUri);
    console.log("📦 Conectado a MongoDB para poblar datos...");

    // Limpiar colecciones actuales
    await Category.deleteMany({});
    await Product.deleteMany({});
    console.log("🧹 Colecciones limpiadas.");

    // 1. Crear 5 categorías
    const catData = [
      { name: "Electrónica" },
      { name: "Ropa y Calzado" },
      { name: "Hogar y Cocina" },
      { name: "Alimentos y Bebidas" },
      { name: "Deportes" }
    ];
    const categorias = await Category.insertMany(catData);
    console.log(`✅ ${categorias.length} categorías creadas.`);

    // Mapa de categorías para asignación de ObjectId
    const catMap = {};
    categorias.forEach(c => catMap[c.name] = c._id);

    // 2. Crear 10 productos
    const prodData = [
      {
        name: "Laptop Pro 15",
        price: 1299.99,
        description: "Potente procesador de 16 núcleos, 16GB RAM y 512GB SSD.",
        imageUrl: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=600&auto=format&fit=crop",
        categoryId: catMap["Electrónica"],
        stock: 15
      },
      {
        name: "Auriculares Inalámbricos Premium",
        price: 199.50,
        description: "Batería de hasta 30 horas y sonido inmersivo Hi-Res con cancelación de ruido.",
        imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop",
        categoryId: catMap["Electrónica"],
        stock: 45
      },
      {
        name: "Smart TV 55K Ultra HD",
        price: 549.99,
        description: "Colores vivos con tecnología HDR10+ y sistema inteligente.",
        imageUrl: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=600&auto=format&fit=crop",
        categoryId: catMap["Electrónica"],
        stock: 10
      },
      {
        name: "Chaqueta Impermeable de Montaña",
        price: 89.90,
        description: "Resistente al viento y la lluvia extrema con costuras selladas.",
        imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600&auto=format&fit=crop",
        categoryId: catMap["Ropa y Calzado"],
        stock: 30
      },
      {
        name: "Zapatillas de Running Ultraligeras",
        price: 119.99,
        description: "Suela con amortiguación reactiva ideal para asfalto.",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop",
        categoryId: catMap["Ropa y Calzado"],
        stock: 25
      },
      {
        name: "Cafetera de Cápsulas Automática",
        price: 75.00,
        description: "Prepara café espresso y lungo con solo pulsar un botón.",
        imageUrl: "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?q=80&w=600&auto=format&fit=crop",
        categoryId: catMap["Hogar y Cocina"],
        stock: 20
      },
      {
        name: "Set de Cuchillos de Chef Profesional",
        price: 49.99,
        description: "Acero inoxidable alemán de alta calidad con bloque de madera.",
        imageUrl: "https://images.unsplash.com/photo-1593618998160-e34014e67546?q=80&w=600&auto=format&fit=crop",
        categoryId: catMap["Hogar y Cocina"],
        stock: 18
      },
      {
        name: "Aceite de Oliva Virgen Extra Ecológico 1L",
        price: 14.50,
        description: "Extracción en frío, acidez máxima del 0.2%.",
        imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=600&auto=format&fit=crop",
        categoryId: catMap["Alimentos y Bebidas"],
        stock: 100
      },
      {
        name: "Caja de Bombones de Chocolate Belga Artesanal",
        price: 22.00,
        description: "Selección premium de pralinés y trufas de chocolate oscuro y con leche.",
        imageUrl: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?q=80&w=600&auto=format&fit=crop",
        categoryId: catMap["Alimentos y Bebidas"],
        stock: 50
      },
      {
        name: "Balón de Fútbol Profesional Tamaño 5",
        price: 35.00,
        description: "Aprobado por competiciones oficiales, cuero sintético duradero.",
        imageUrl: "https://images.unsplash.com/photo-1614632537190-23e4146777db?q=80&w=600&auto=format&fit=crop",
        categoryId: catMap["Deportes"],
        stock: 40
      }
    ];

    const productos = await Product.insertMany(prodData);
    console.log(`✅ ${productos.length} productos creados exitosamente.`);

    console.log("🎉 ¡Base de datos poblada con éxito!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error al poblar base de datos:", error);
    process.exit(1);
  }
};

seedDatabase();
