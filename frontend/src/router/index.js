import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import ProductDetailView from '@/views/ProductDetailView.vue';
import NotFoundView from '@/views/NotFoundView.vue';
import ProductFormView from '@/views/ProductFormView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/product/new', name: 'product-new', component: ProductFormView },
  { path: '/product/:id/edit', name: 'product-edit', component: ProductFormView },
  { path: '/product/:id', name: 'product-detail', component: ProductDetailView },
  { path: '/cart', name: 'cart', component: () => import('@/views/CartView.vue') },
  { path: '/about', name: 'about', component: () => import('@/views/AboutView.vue') },
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' };
  }
});

export default router;
