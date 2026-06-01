# 📦 MiInventarioExpress - Programación Web (Unidad 3)

Bienvenido a **MiInventarioExpress**, una plataforma integral de gestión de inventario. Este proyecto ha sido evolucionado a una arquitectura moderna (SPA) separando completamente el Backend (Node/Express) del Frontend (Vue 3 + Vite) para cumplir con todos los requerimientos avanzados de la Unidad 3 de Programación Web.

---

## 🚀 Arquitectura y Tecnologías

### Backend (API REST)
*   **Servidor:** Node.js con Express.js.
*   **Base de Datos:** MongoDB y Mongoose (Modelos `Category` y `Product` con relaciones ObjectId).
*   **Validaciones y Errores:** Manejo estricto de códigos HTTP (`400 Bad Request`, `404 Not Found`, `500 Internal Error`).
*   **Tiempo Real:** Actualizaciones instantáneas vía Socket.io.
*   **Siembra de Datos (Seed):** Script automatizado para poblar categorías y productos de prueba.

### Frontend Moderno (SPA)
*   **Framework:** Vue 3 (Composition API y estructura SFC `<script setup>`).
*   **Bundler:** Vite con configuración avanzada (Alias `@` y Proxy de desarrollo).
*   **Enrutamiento:** Vue Router 4 con manejo de rutas no encontradas (404).
*   **Rendimiento:** *Lazy Loading* (Carga Perezosa) de vistas y manejo de componentes asíncronos con `<Suspense>` nativo de Vue.
*   **Estado Global:** Composables personalizados para persistencia de carrito en `localStorage` y manejo centralizado de peticiones HTTP.
*   **Diseño:** UI/UX premium utilizando metodologías CSS Glassmorphism y diseño responsivo.

---

## ✨ Funcionalidades Principales

### 1. Catálogo Reactivo y Composables
*   Consumo concurrente de la API (`/api/products` y `/api/categories`).
*   Filtros dinámicos en tiempo real (por nombre, descripción y categoría) manejados íntegramente mediante **Propiedades Computadas** (`computed`).
*   **Composables Dedicados:** `useApi` y `useProducts` que centralizan la lógica de fetch, manejo de estados (`loading`, `error`), retries automáticos y cancelación (abort) de peticiones huérfanas.

### 2. Carrito de Compras Persistente
*   El estado del carrito es orquestado por el composable `useCart.js`.
*   Posibilidad de agregar, eliminar y cambiar la cantidad de productos, validando matemáticamente siempre contra el **stock máximo** disponible en el servidor.
*   Total a pagar calculado mediante variables reactivas, y guardado automático en `localStorage`.

### 3. Formularios Avanzados (`v-model`)
*   Sistema reutilizable (`ProductFormView.vue`) para **Alta y Edición** de productos.
*   Validación estricta de formulario en tiempo real desde el frontend: nombres obligatorios, precios y stock numéricos coherentes, validación estricta de URL de imágenes y selección de categoría.

---

## 🛠️ Instrucciones de Instalación y Ejecución

Para correr todo el sistema localmente, debes levantar tanto el Backend como el Frontend simultáneamente.

### Paso 1: Configurar e iniciar el Backend
1. Abre tu terminal en la carpeta raíz del proyecto.
2. Instala las dependencias:
   ```bash
   npm install
   ```
3. Llena la base de datos con información de prueba utilizando nuestro script *seed*:
   ```bash
   npm run seed
   ```
4. Configura tus variables de entorno creando un archivo `.env` basado en `.env.example`:
   ```bash
   cp .env.example .env
   ```
5. Inicia el servidor backend:
   ```bash
   node app.js
   ```
   *(El servidor correrá en `http://localhost:3000`)*

### Paso 2: Iniciar el Frontend (Vue 3)
1. Abre una **nueva pestaña** en tu terminal y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias exclusivas del frontend:
   ```bash
   npm install
   ```
3. Levanta el entorno de desarrollo de Vite:
   ```bash
   npm run dev
   ```
4. **Visita en tu navegador:** 👉 `http://localhost:5173`

*(Vite está preconfigurado para enviar todas las peticiones de `/api` automáticamente a tu servidor Node.js local).*

---

## 🚀 Despliegue (Producción)

### Construir el Frontend
Para compilar el frontend y prepararlo para producción, ejecuta:
```bash
cd frontend
npm run build
```
Esto generará una carpeta `dist` con los archivos estáticos optimizados.

### Desplegar el Backend y Base de Datos
1. Asegúrate de tener una instancia de MongoDB en la nube (ej. MongoDB Atlas).
2. Configura tu archivo `.env` en producción con las variables correctas (puerto, URL de Mongo, secreto de sesión).
3. Sube el código del servidor a plataformas como Render, Heroku o Railway.
4. (Opcional) Puedes configurar Express para servir la carpeta `frontend/dist` estáticamente si deseas alojar todo en un solo servicio:
   ```javascript
   app.use(express.static(path.join(__dirname, 'frontend/dist')));
   ```

---
**Desarrollado como Proyecto Integrador - Programación Web (Unidad 3)**
