<script setup>
import { computed } from 'vue';
import { useCart } from '@/composables/useCart';

defineProps({
  title: {
    type: String,
    default: "MiInventarioExpress"
  }
});

const { cart } = useCart();
const cartCount = computed(() => cart.value.reduce((acc, i) => acc + i.quantity, 0));
</script>

<template>
  <nav class="navbar">
    <router-link to="/" class="nav-brand">
      <span class="logo-icon">📦</span>
      <span class="brand-text">{{ title }}</span>
    </router-link>

    <div class="nav-links">
      <router-link to="/" class="nav-item">Catálogo</router-link>
      <router-link to="/product/new" class="nav-item">Crear Producto</router-link>
      <router-link to="/about" class="nav-item">Acerca de</router-link>
      
      <router-link to="/cart" class="nav-cart">
        <span class="cart-icon">🛒</span>
        <span class="cart-label">Carrito</span>
        <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
      </router-link>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 0;
  z-index: 100;
}

@media (max-width: 640px) {
  .navbar {
    padding: 1rem 1.5rem;
  }
  .cart-label {
    display: none;
  }
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.4rem;
  font-weight: 800;
  color: #0f172a;
  text-decoration: none;
}

.logo-icon {
  font-size: 1.75rem;
}

.brand-text {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-item {
  color: #64748b;
  font-weight: 700;
  font-size: 1.05rem;
  text-decoration: none;
  transition: color 0.2s;
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
}

.nav-item:hover, .router-link-active.nav-item {
  color: #0f172a;
  background: #f1f5f9;
}

.nav-cart {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  padding: 0.6rem 1.25rem;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 800;
  font-size: 1rem;
  box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.nav-cart:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(59, 130, 246, 0.4);
}

.cart-icon {
  font-size: 1.2rem;
}

.cart-badge {
  background: white;
  color: #8b5cf6;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-size: 0.85rem;
  font-weight: 900;
}
</style>
