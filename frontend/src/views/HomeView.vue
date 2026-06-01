<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '@/composables/useCart';
import { useProducts } from '@/composables/useProducts';
import ProductCard from '@/components/ProductCard.vue';

const router = useRouter();
const { addToCart } = useCart();
const { products: productos, categories: categorias, isLoading: loading, error, fetchAll, cancelAll } = useProducts();

const busqueda = ref('');
const categoriaSeleccionada = ref('');

onMounted(() => {
  fetchAll();
});

onUnmounted(() => {
  cancelAll();
});

const productosFiltrados = computed(() => {
  return productos.value.filter(p => {
    const searchLower = busqueda.value.toLowerCase();
    const nombreMatch = (p.name || p.nombre || '').toLowerCase().includes(searchLower);
    const descMatch = (p.description || p.descripcion || '').toLowerCase().includes(searchLower);
    
    const catMatch = !categoriaSeleccionada.value || p.categoryId?._id === categoriaSeleccionada.value || p.categoryId === categoriaSeleccionada.value;
    
    return (nombreMatch || descMatch) && catMatch;
  });
});

const irDetalle = (id) => {
  router.push(`/product/${id}`);
};

const agregar = (producto) => {
  addToCart(producto, 1);
  alert(`¡${producto.name || producto.nombre} añadido al carrito!`);
};
</script>

<template>
  <div class="home-container">
    <div class="header-section">
      <h1>Catálogo de Productos 🛍️</h1>
      <p>Explora nuestro inventario con filtros dinámicos en tiempo real.</p>
    </div>

    <!-- Filtros y Búsqueda -->
    <div class="filters-bar">
      <div class="search-box">
        <span class="icon">🔍</span>
        <input 
          type="text" 
          v-model="busqueda" 
          placeholder="Buscar producto por nombre o descripción..."
        />
      </div>
      <div class="category-select">
        <span class="icon">📁</span>
        <select v-model="categoriaSeleccionada">
          <option value="">Todas las categorías</option>
          <option v-for="cat in categorias" :key="cat._id" :value="cat._id">
            {{ cat.name }}
          </option>
        </select>
      </div>
    </div>

    <!-- Indicador de Carga / Error -->
    <div v-if="loading" class="state-container">
      <div class="spinner"></div>
      <p>Cargando inventario...</p>
    </div>

    <div v-else-if="error" class="state-container error">
      <p>❌ {{ error }}</p>
    </div>

    <div v-else-if="productosFiltrados.length === 0" class="state-container empty">
      <p>No se encontraron productos con esos filtros.</p>
    </div>

    <!-- Grid de Productos -->
    <div v-else class="products-grid">
      <ProductCard 
        v-for="p in productosFiltrados" 
        :key="p._id" 
        :product="p" 
        @view-detail="irDetalle(p._id)"
        @added-to-cart="agregar(p)" 
      />
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 1rem 0 3rem;
}

.header-section {
  margin-bottom: 2.5rem;
  text-align: center;
}

.header-section h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.header-section p {
  color: #64748b;
  font-size: 1.1rem;
}

.filters-bar {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 3rem;
  background: rgba(255, 255, 255, 0.8);
  padding: 1.25rem;
  border-radius: 20px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

@media (max-width: 768px) {
  .filters-bar {
    flex-direction: column;
    gap: 1rem;
  }
}

.search-box, .category-select {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  border-radius: 14px;
  padding: 0.75rem 1.25rem;
  flex: 1;
}

.search-box input, .category-select select {
  border: none;
  background: transparent;
  width: 100%;
  font-size: 1rem;
  color: #334155;
  outline: none;
}

.state-container {
  text-align: center;
  padding: 5rem 0;
  color: #64748b;
  font-size: 1.2rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #cbd5e1;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
}
</style>
