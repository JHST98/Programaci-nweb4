<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCart } from '@/composables/useCart';
import { useApi } from '@/composables/useApi';

const route = useRoute();
const router = useRouter();
const { addToCart } = useCart();

const { data: producto, loading, error, execute, cancel } = useApi(`/api/products/${route.params.id}`);
const cantidad = ref(1);

onMounted(async () => {
  await execute();
  if (error.value && (error.value.includes('404') || error.value.includes('400'))) {
    router.push('/404');
  } else if (!producto.value && !loading.value) {
    router.push('/404');
  }
});

watch(error, (newErr) => {
  if (newErr && (newErr.includes('404') || newErr.includes('400'))) {
    router.push('/404');
  }
});

onUnmounted(() => {
  cancel();
});

const agregar = () => {
  if (!producto.value || cantidad.value <= 0) return;
  addToCart(producto.value, cantidad.value);
  alert(`¡Añadido(s) ${cantidad.value} al carrito!`);
};

const volver = () => {
  router.push('/');
};
</script>

<template>
  <div class="detail-container">
    <div v-if="loading" class="state-box">
      <div class="spinner"></div>
      <p>Cargando detalles del producto...</p>
    </div>

    <div v-else-if="error" class="state-box error">
      <p>❌ {{ error }}</p>
      <button @click="volver" class="btn-back">Volver al Catálogo</button>
    </div>

    <div v-else-if="producto" class="product-layout">
      <!-- Imagen -->
      <div class="img-panel">
        <img v-if="producto.imageUrl || producto.imagen" :src="producto.imageUrl || producto.imagen" :alt="producto.name || producto.nombre" />
        <div v-else class="no-img">Sin Imagen Disponible</div>
      </div>

      <!-- Info del Producto -->
      <div class="info-panel">
        <div class="top-actions">
          <button @click="volver" class="btn-back-link">← Volver al catálogo</button>
          <button @click="router.push(`/product/${producto._id}/edit`)" class="btn-edit-link">✏️ Editar Producto</button>
        </div>
        
        <div class="badges-row">
          <span class="cat-badge">📁 {{ producto.categoryId?.name || 'General' }}</span>
          <span :class="['stock-badge', producto.stock > 0 ? 'in-stock' : 'no-stock']">
            {{ producto.stock > 0 ? `📦 Stock: ${producto.stock} disponibles` : '⚠️ Producto Agotado' }}
          </span>
        </div>

        <h1>{{ producto.name || producto.nombre }}</h1>
        <div class="price-tag">${{ producto.price !== undefined ? producto.price : producto.precio }}</div>

        <div class="desc-box">
          <h3>Descripción</h3>
          <p>{{ producto.description || producto.descripcion || 'Este producto no tiene una descripción especificada.' }}</p>
        </div>

        <!-- Opciones de Compra -->
        <div v-if="producto.stock > 0" class="purchase-box">
          <div class="quantity-picker">
            <label for="qty">Cantidad:</label>
            <div class="controls">
              <button @click="cantidad > 1 && cantidad--" class="btn-qty">-</button>
              <input type="number" id="qty" v-model.number="cantidad" min="1" :max="producto.stock" readonly />
              <button @click="cantidad < producto.stock && cantidad++" class="btn-qty">+</button>
            </div>
          </div>

          <button @click="agregar" class="btn-add-cart">
            🛒 Añadir al Carrito (${{ ((producto.price !== undefined ? producto.price : producto.precio) * cantidad).toFixed(2) }})
          </button>
        </div>

        <div v-else class="sold-out-box">
          Este producto se encuentra actualmente agotado en nuestro almacén.
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.detail-container {
  padding: 2rem 0 5rem;
}

.state-box {
  text-align: center;
  padding: 8rem 0;
  color: #64748b;
  font-size: 1.25rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #cbd5e1;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-back {
  margin-top: 1.5rem;
  padding: 0.8rem 1.5rem;
  background: #0f172a;
  color: white;
  border-radius: 12px;
  border: none;
  font-weight: 700;
}

.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  background: rgba(255, 255, 255, 0.85);
  border-radius: 32px;
  padding: 3rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

@media (max-width: 992px) {
  .product-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
    padding: 2rem;
  }
}

.img-panel {
  border-radius: 24px;
  overflow: hidden;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  border: 1px solid #e2e8f0;
}

.img-panel img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-img {
  color: #94a3b8;
  font-size: 1.25rem;
  font-weight: 600;
}

.info-panel {
  display: flex;
  flex-direction: column;
}

.top-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-back-link, .btn-edit-link {
  background: transparent;
  border: none;
  font-weight: 700;
  font-size: 1rem;
  padding: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-back-link {
  color: #64748b;
}

.btn-back-link:hover {
  color: #0f172a;
}

.btn-edit-link {
  color: #8b5cf6;
}

.btn-edit-link:hover {
  color: #6d28d9;
}

.badges-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 0.9rem;
}

.cat-badge {
  background: #e2e8f0;
  color: #334155;
  padding: 0.35rem 0.8rem;
  border-radius: 16px;
}

.stock-badge {
  padding: 0.35rem 0.8rem;
  border-radius: 16px;
}

.in-stock { background: #dcfce7; color: #15803d; }
.no-stock { background: #fee2e2; color: #b91c1c; }

h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 1rem;
  line-height: 1.2;
}

.price-tag {
  font-size: 2.25rem;
  font-weight: 800;
  color: #8b5cf6;
  margin-bottom: 2rem;
}

.desc-box {
  margin-bottom: 2.5rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.5rem;
}

.desc-box h3 {
  font-size: 1.1rem;
  color: #0f172a;
  margin: 0 0 0.5rem;
}

.desc-box p {
  color: #64748b;
  font-size: 1.05rem;
  line-height: 1.6;
}

.purchase-box {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 1.75rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.quantity-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
  color: #334155;
}

.controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-qty {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: white;
  font-weight: 700;
  font-size: 1.2rem;
  color: #0f172a;
}

.btn-qty:hover {
  background: #e2e8f0;
}

.controls input {
  width: 50px;
  text-align: center;
  border: none;
  background: transparent;
  font-weight: 800;
  font-size: 1.1rem;
  color: #0f172a;
  outline: none;
}

.btn-add-cart {
  width: 100%;
  padding: 1rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-weight: 800;
  font-size: 1.15rem;
  border: none;
  box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-add-cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(139, 92, 246, 0.4);
}

.sold-out-box {
  background: #fee2e2;
  border: 1px solid #f87171;
  color: #991b1b;
  padding: 1.5rem;
  border-radius: 16px;
  text-align: center;
  font-weight: 700;
}
</style>
