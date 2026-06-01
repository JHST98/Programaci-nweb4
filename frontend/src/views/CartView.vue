<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCart } from '@/composables/useCart';

const router = useRouter();
const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

const total = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

const procederPago = () => {
  if (cart.value.length === 0) return;
  alert("¡Compra realizada con éxito! Gracias por probar MiInventarioExpress.");
  clearCart();
  router.push('/');
};
</script>

<template>
  <div class="cart-container">
    <div class="header-box">
      <h1>Tu Carrito de Compras 🛒</h1>
      <p v-if="cart.length > 0">Revisa los artículos seleccionados antes de finalizar tu pedido.</p>
    </div>

    <div v-if="cart.length === 0" class="empty-state">
      <div class="empty-icon">🛍️</div>
      <h2>Tu carrito está vacío</h2>
      <p>Aún no has añadido ningún producto al carrito de compras.</p>
      <router-link to="/" class="btn-browse">Explorar Catálogo</router-link>
    </div>

    <div v-else class="cart-layout">
      <!-- Lista de Artículos -->
      <div class="items-list">
        <div v-for="item in cart" :key="item._id" class="cart-item">
          <div class="item-img">
            <img v-if="item.imageUrl" :src="item.imageUrl" :alt="item.name" />
            <div v-else class="no-img">📦</div>
          </div>
          
          <div class="item-details">
            <h3>{{ item.name }}</h3>
            <p class="unit-price">${{ item.price.toFixed(2) }} c/u</p>
          </div>

          <div class="quantity-controls">
            <button @click="updateQuantity(item._id, item.quantity - 1)" class="btn-qty">-</button>
            <span class="qty">{{ item.quantity }}</span>
            <button @click="updateQuantity(item._id, item.quantity + 1)" class="btn-qty" :disabled="item.quantity >= item.stock">+</button>
          </div>

          <div class="item-total">
            ${{ (item.price * item.quantity).toFixed(2) }}
          </div>

          <button @click="removeFromCart(item._id)" class="btn-delete" title="Eliminar artículo">🗑️</button>
        </div>
      </div>

      <!-- Resumen del Pedido -->
      <div class="summary-box">
        <h2>Resumen del Pedido</h2>
        <div class="summary-row">
          <span>Artículos en carrito:</span>
          <span>{{ cart.reduce((acc, i) => acc + i.quantity, 0) }}</span>
        </div>
        <div class="summary-row">
          <span>Envío:</span>
          <span class="free-shipping">¡Gratis!</span>
        </div>
        <div class="summary-divider"></div>
        <div class="summary-total">
          <span>Total a Pagar:</span>
          <span class="total-price">${{ total.toFixed(2) }}</span>
        </div>

        <button @click="procederPago" class="btn-checkout">Proceder al Pago 🚀</button>
        <button @click="clearCart" class="btn-clear">Vaciar Carrito</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cart-container {
  padding: 1rem 0 5rem;
}

.header-box {
  margin-bottom: 3rem;
  text-align: center;
}

.header-box h1 {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.header-box p {
  color: #64748b;
  font-size: 1.1rem;
}

.empty-state {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 32px;
  padding: 6rem 2rem;
  text-align: center;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 1.5rem;
}

.empty-state h2 {
  font-size: 2rem;
  color: #0f172a;
  margin: 0 0 0.5rem;
}

.empty-state p {
  color: #64748b;
  font-size: 1.1rem;
  margin-bottom: 2.5rem;
}

.btn-browse {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
  border-radius: 16px;
  text-decoration: none;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-browse:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(59, 130, 246, 0.4);
}

.cart-layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 3rem;
}

@media (max-width: 992px) {
  .cart-layout {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.cart-item {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 20px;
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}

@media (max-width: 640px) {
  .cart-item {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
}

.item-img {
  width: 80px;
  height: 80px;
  border-radius: 14px;
  overflow: hidden;
  background: #f1f5f9;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
}

.item-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h3 {
  margin: 0 0 0.25rem;
  font-size: 1.15rem;
  color: #0f172a;
  font-weight: 700;
}

.unit-price {
  color: #64748b;
  font-size: 0.95rem;
}

.quantity-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
}

.btn-qty {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  background: white;
  font-weight: 700;
  font-size: 1.1rem;
  color: #0f172a;
}

.btn-qty:hover:not(:disabled) {
  background: #e2e8f0;
}

.btn-qty:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.qty {
  font-weight: 800;
  font-size: 1.05rem;
  color: #0f172a;
  min-width: 24px;
  text-align: center;
}

.item-total {
  font-weight: 800;
  font-size: 1.2rem;
  color: #8b5cf6;
  min-width: 100px;
  text-align: right;
}

.btn-delete {
  background: transparent;
  border: none;
  font-size: 1.25rem;
  opacity: 0.6;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-delete:hover {
  opacity: 1;
  transform: scale(1.1);
}

.summary-box {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 28px;
  padding: 2.25rem;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  height: fit-content;
}

.summary-box h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 1.75rem;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  color: #64748b;
  font-size: 1.05rem;
  margin-bottom: 1rem;
}

.free-shipping {
  color: #15803d;
  font-weight: 700;
  background: #dcfce7;
  padding: 0.1rem 0.5rem;
  border-radius: 10px;
}

.summary-divider {
  height: 1px;
  background: #e2e8f0;
  margin: 1.5rem 0;
}

.summary-total {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 2.25rem;
}

.total-price {
  color: #8b5cf6;
  font-size: 1.8rem;
}

.btn-checkout {
  width: 100%;
  padding: 1.1rem;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  font-weight: 800;
  font-size: 1.15rem;
  border: none;
  box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.3);
  margin-bottom: 1rem;
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-checkout:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(139, 92, 246, 0.4);
}

.btn-clear {
  width: 100%;
  padding: 0.8rem;
  border-radius: 12px;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  font-weight: 700;
  transition: background 0.2s, color 0.2s;
}

.btn-clear:hover {
  background: #fee2e2;
  color: #b91c1c;
}
</style>
