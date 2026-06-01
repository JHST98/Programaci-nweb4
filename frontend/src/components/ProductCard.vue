<script setup>
defineProps({
  product: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['added-to-cart', 'view-detail']);

const handleAddCart = () => {
  emit('added-to-cart');
};

const handleViewDetail = () => {
  emit('view-detail');
};
</script>

<template>
  <div class="product-card">
    <div class="img-container">
      <img v-if="product.imageUrl || product.imagen" :src="product.imageUrl || product.imagen" :alt="product.name || product.nombre" />
      <div v-else class="no-img">Sin Imagen</div>
      <span class="price-badge">${{ product.price !== undefined ? product.price : product.precio }}</span>
    </div>
    <div class="card-content">
      <div class="meta-tags">
        <span class="cat-tag">{{ product.categoryId?.name || 'Sin categoría' }}</span>
        <span :class="['stock-tag', product.stock > 0 ? 'in-stock' : 'no-stock']">
          {{ product.stock > 0 ? `📦 Stock: ${product.stock}` : '⚠️ Agotado' }}
        </span>
      </div>
      <h3>{{ product.name || product.nombre }}</h3>
      <p class="desc">{{ product.description || product.descripcion || 'Sin descripción disponible.' }}</p>
      <div class="actions">
        <button @click="handleViewDetail" class="btn-detail">Ver Detalle</button>
        <button @click="handleAddCart" :disabled="product.stock <= 0" class="btn-cart">
          {{ product.stock > 0 ? '🛒 Añadir' : 'Agotado' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(226, 232, 240, 0.8);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.img-container {
  height: 220px;
  position: relative;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.product-card:hover .img-container img {
  transform: scale(1.05);
}

.no-img {
  color: #94a3b8;
  font-weight: 500;
}

.price-badge {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(15, 23, 42, 0.85);
  color: #fff;
  padding: 0.4rem 0.8rem;
  border-radius: 12px;
  font-weight: 800;
  font-size: 1.1rem;
  backdrop-filter: blur(8px);
}

.card-content {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.meta-tags {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  font-weight: 700;
}

.cat-tag {
  background: #e2e8f0;
  color: #475569;
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
}

.stock-tag {
  padding: 0.25rem 0.6rem;
  border-radius: 12px;
}

.in-stock { background: #dcfce7; color: #15803d; }
.no-stock { background: #fee2e2; color: #b91c1c; }

.card-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1.25rem;
  color: #0f172a;
  font-weight: 700;
}

.desc {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.actions {
  display: flex;
  gap: 0.75rem;
}

.btn-detail, .btn-cart {
  flex: 1;
  padding: 0.75rem 1rem;
  border-radius: 14px;
  font-weight: 700;
  font-size: 0.95rem;
  border: none;
  transition: background 0.2s, transform 0.1s;
}

.btn-detail {
  background: #f1f5f9;
  color: #334155;
}

.btn-detail:hover {
  background: #e2e8f0;
}

.btn-cart {
  background: #3b82f6;
  color: white;
}

.btn-cart:hover:not(:disabled) {
  background: #2563eb;
}

.btn-cart:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
</style>
