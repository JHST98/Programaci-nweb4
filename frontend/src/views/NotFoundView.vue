<template>
  <div class="not-found-container">
    <div class="error-card">
      <div class="error-code">404</div>
      <h1>Página No Encontrada</h1>
      <p>Lo sentimos, la ruta que estás intentando visitar no existe o ha sido movida.</p>
      
      <div class="action-box">
        <router-link to="/" class="btn-home">← Volver al Inicio</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  padding: 2rem;
}

.error-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 36px;
  padding: 5rem 4rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

.error-code {
  font-size: 7rem;
  font-weight: 900;
  background: linear-gradient(135deg, #ef4444, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1;
  margin-bottom: 1rem;
}

h1 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 1rem;
}

p {
  color: #64748b;
  font-size: 1.15rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.btn-home {
  display: inline-block;
  padding: 1rem 2.5rem;
  background: #0f172a;
  color: white;
  font-weight: 800;
  font-size: 1.1rem;
  border-radius: 16px;
  text-decoration: none;
  box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.2);
  transition: transform 0.2s, background 0.2s;
}

.btn-home:hover {
  transform: translateY(-2px);
  background: #334155;
}
</style>
