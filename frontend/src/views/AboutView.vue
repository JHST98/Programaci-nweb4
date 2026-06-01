<template>
  <div class="about-container">
    <div class="header-box">
      <h1>Acerca del Proyecto 💡</h1>
      <p>Gestión de Inventario y Catálogo en Tiempo Real</p>
    </div>

    <div class="content-box">
      <h2>Programación Web - Unidad 3</h2>
      <p>
        Esta aplicación de página única (SPA) fue desarrollada utilizando las mejores prácticas de arquitectura moderna. 
        Combina un backend robusto en Node.js y Express con un frontend reactivo ultrarrápido en Vue 3 y Vite.
      </p>

      <div class="tech-grid">
        <div class="tech-card">
          <span class="tech-icon">⚡</span>
          <h3>Vue 3 + Vite</h3>
          <p>Frontend con arquitectura Single File Component (SFC) y reactividad basada en Composition API y `&lt;script setup&gt;`.</p>
        </div>

        <div class="tech-card">
          <span class="tech-icon">📦</span>
          <h3>Node.js + Express</h3>
          <p>API RESTful con validaciones estrictas y manejo riguroso de códigos HTTP (400, 404, 500).</p>
        </div>

        <div class="tech-card">
          <span class="tech-icon">🍃</span>
          <h3>Mongoose + MongoDB</h3>
          <p>Persistencia de datos y relaciones mediante ObjectIds entre productos y categorías con siembra (seed) automatizada.</p>
        </div>

        <div class="tech-card">
          <span class="tech-icon">🔄</span>
          <h3>Socket.io</h3>
          <p>Actualizaciones bidireccionales en tiempo real para mantener el inventario sincronizado entre múltiples usuarios.</p>
        </div>
      </div>

      <div class="author-footer">
        <p>Desarrollado para la evaluación de Programación Web. ¡Gracias por explorar la aplicación!</p>
        <router-link to="/" class="btn-home">Explorar Catálogo</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  padding: 1rem 0 5rem;
  max-width: 900px;
  margin: 0 auto;
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
  font-size: 1.15rem;
}

.content-box {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 32px;
  padding: 3.5rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

@media (max-width: 768px) {
  .content-box {
    padding: 2.25rem;
  }
}

.content-box h2 {
  font-size: 1.8rem;
  color: #0f172a;
  font-weight: 800;
  margin: 0 0 1rem;
}

.content-box > p {
  color: #475569;
  font-size: 1.1rem;
  line-height: 1.7;
  margin-bottom: 3rem;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.75rem;
  margin-bottom: 3.5rem;
}

.tech-card {
  background: #f8fafc;
  border: 1px solid #cbd5e1;
  padding: 1.75rem;
  border-radius: 20px;
  transition: transform 0.2s, background 0.2s;
}

.tech-card:hover {
  transform: translateY(-4px);
  background: white;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05);
}

.tech-icon {
  font-size: 2.25rem;
  display: block;
  margin-bottom: 1rem;
}

.tech-card h3 {
  font-size: 1.25rem;
  color: #0f172a;
  margin: 0 0 0.5rem;
  font-weight: 700;
}

.tech-card p {
  color: #64748b;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.author-footer {
  text-align: center;
  border-top: 1px solid #e2e8f0;
  padding-top: 2.5rem;
}

.author-footer p {
  color: #64748b;
  font-size: 1.05rem;
  margin-bottom: 1.75rem;
}

.btn-home {
  display: inline-block;
  padding: 0.95rem 2.25rem;
  background: #0f172a;
  color: white;
  font-weight: 700;
  font-size: 1.05rem;
  border-radius: 16px;
  text-decoration: none;
  transition: background 0.2s;
}

.btn-home:hover {
  background: #334155;
}
</style>
