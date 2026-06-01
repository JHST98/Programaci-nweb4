import { ref, watch } from 'vue';

const CART_STORAGE_KEY = 'express_cart';
const cart = ref(JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]'));

watch(cart, (newVal) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newVal));
}, { deep: true });

export function useCart() {
  const addToCart = (product, quantity = 1) => {
    const existing = cart.value.find(item => item._id === product._id);
    if (existing) {
      if (existing.quantity + quantity <= product.stock) {
        existing.quantity += quantity;
      } else {
        existing.quantity = product.stock;
      }
    } else {
      cart.value.push({
        _id: product._id,
        name: product.name || product.nombre,
        price: product.price !== undefined ? product.price : product.precio,
        imageUrl: product.imageUrl || product.imagen,
        stock: product.stock !== undefined ? product.stock : 10,
        quantity: Math.min(quantity, (product.stock !== undefined ? product.stock : 10) || 1)
      });
    }
  };

  const removeFromCart = (id) => {
    cart.value = cart.value.filter(item => item._id !== id);
  };

  const updateQuantity = (id, quantity) => {
    const existing = cart.value.find(item => item._id === id);
    if (existing) {
      if (quantity <= 0) {
        removeFromCart(id);
      } else {
        existing.quantity = Math.min(quantity, existing.stock);
      }
    }
  };

  const clearCart = () => {
    cart.value = [];
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart
  };
}
