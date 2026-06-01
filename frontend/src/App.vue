<script setup>
import Navbar from '@/components/Navbar.vue';
</script>

<template>
  <div class="app-container">
    <Navbar title="MiInventarioExpress" />
    
    <main class="main-content">
      <!-- Vue Router inyecta dinámicamente las vistas aquí con Suspense y Transiciones -->
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <Suspense>
            <template #default>
              <component :is="Component" />
            </template>
            <template #fallback>
              <div class="suspense-loading">
                <div class="spinner"></div>
                <p>Cargando módulo...</p>
              </div>
            </template>
          </Suspense>
        </transition>
      </router-view>
    </main>

    <footer class="app-footer">
      <p>MiInventarioExpress Vue 3 SPA • Tarea Unidad 3</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: #334155;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2.5rem 2rem;
  width: 100%;
  box-sizing: border-box;
}

.app-footer {
  text-align: center;
  padding: 2rem;
  border-top: 1px solid rgba(226, 232, 240, 0.8);
  color: #64748b;
  font-size: 0.95rem;
  font-weight: 600;
}

/* Animaciones de Transición entre Páginas */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* Estilos para el fallback de Suspense */
.suspense-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
  color: #64748b;
  font-weight: 600;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #cbd5e1;
  border-top-color: #8b5cf6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
