<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useApi } from '@/composables/useApi';

const route = useRoute();
const router = useRouter();

const isEditMode = computed(() => !!route.params.id);
const pageTitle = computed(() => isEditMode.value ? 'Editar Producto' : 'Crear Nuevo Producto');

// Form state
const formData = ref({
  name: '',
  description: '',
  price: 0,
  categoryId: '',
  stock: 0,
  imageUrl: ''
});

const errors = ref({});
const isSubmitting = ref(false);
const submitError = ref(null);

const { data: categories, execute: fetchCategories } = useApi('/api/categories');

onMounted(async () => {
  await fetchCategories();

  if (isEditMode.value) {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${baseUrl}/api/products/${route.params.id}`);
      if (response.ok) {
        const product = await response.json();
        formData.value = {
          name: product.name || product.nombre || '',
          description: product.description || product.descripcion || '',
          price: product.price !== undefined ? product.price : product.precio,
          categoryId: product.categoryId?._id || product.categoryId || '',
          stock: product.stock !== undefined ? product.stock : 0,
          imageUrl: product.imageUrl || product.imagen || ''
        };
      } else {
        router.push('/404');
      }
    } catch (err) {
      console.error('Error fetching product for edit:', err);
      submitError.value = 'No se pudo cargar el producto para editar.';
    }
  }
});

const validateForm = () => {
  errors.value = {};
  let isValid = true;

  if (!formData.value.name.trim()) {
    errors.value.name = 'El nombre es obligatorio.';
    isValid = false;
  }

  if (formData.value.price <= 0 || isNaN(formData.value.price)) {
    errors.value.price = 'El precio debe ser un número mayor a 0.';
    isValid = false;
  }

  if (!formData.value.categoryId) {
    errors.value.categoryId = 'Debe seleccionar una categoría.';
    isValid = false;
  }

  if (formData.value.stock < 0 || !Number.isInteger(Number(formData.value.stock))) {
    errors.value.stock = 'El stock debe ser un número entero mayor o igual a 0.';
    isValid = false;
  }

  if (formData.value.imageUrl) {
    try {
      new URL(formData.value.imageUrl);
    } catch (_) {
      errors.value.imageUrl = 'Debe ser una URL de imagen válida (http/https).';
      isValid = false;
    }
  }

  return isValid;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  isSubmitting.value = true;
  submitError.value = null;

  const url = isEditMode.value ? `/api/products/${route.params.id}` : '/api/products';
  const baseUrl = import.meta.env.VITE_API_URL || '';
  const fullUrl = `${baseUrl}${url}`;
  const method = isEditMode.value ? 'PUT' : 'POST';

  try {
    const response = await fetch(fullUrl, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData.value)
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || errData.error || 'Error al guardar el producto');
    }

    alert(isEditMode.value ? 'Producto actualizado con éxito!' : 'Producto creado con éxito!');
    router.push('/');
  } catch (err) {
    submitError.value = err.message;
  } finally {
    isSubmitting.value = false;
  }
};
</script>

<template>
  <div class="form-container">
    <div class="form-card">
      <div class="form-header">
        <h1>{{ pageTitle }}</h1>
        <p v-if="!isEditMode">Añade un nuevo ítem al inventario del sistema.</p>
        <p v-else>Modifica los datos del producto existente.</p>
      </div>

      <div v-if="submitError" class="alert-error">
        ❌ {{ submitError }}
      </div>

      <form @submit.prevent="handleSubmit" class="product-form">
        
        <!-- Nombre -->
        <div class="form-group">
          <label for="name">Nombre del Producto <span class="required">*</span></label>
          <input 
            type="text" 
            id="name" 
            v-model="formData.name" 
            :class="{ 'input-error': errors.name }"
            placeholder="Ej: Laptop Pro 15"
          />
          <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
        </div>

        <!-- Categoría -->
        <div class="form-group">
          <label for="category">Categoría <span class="required">*</span></label>
          <select 
            id="category" 
            v-model="formData.categoryId"
            :class="{ 'input-error': errors.categoryId }"
          >
            <option value="" disabled>Selecciona una categoría...</option>
            <option v-for="cat in categories" :key="cat._id" :value="cat._id">
              {{ cat.name }}
            </option>
          </select>
          <span v-if="errors.categoryId" class="error-msg">{{ errors.categoryId }}</span>
        </div>

        <!-- Precio y Stock en 2 columnas -->
        <div class="form-row">
          <div class="form-group half">
            <label for="price">Precio ($) <span class="required">*</span></label>
            <input 
              type="number" 
              id="price" 
              v-model.number="formData.price" 
              step="0.01"
              min="0.01"
              :class="{ 'input-error': errors.price }"
            />
            <span v-if="errors.price" class="error-msg">{{ errors.price }}</span>
          </div>

          <div class="form-group half">
            <label for="stock">Stock Disponible <span class="required">*</span></label>
            <input 
              type="number" 
              id="stock" 
              v-model.number="formData.stock" 
              min="0"
              step="1"
              :class="{ 'input-error': errors.stock }"
            />
            <span v-if="errors.stock" class="error-msg">{{ errors.stock }}</span>
          </div>
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label for="description">Descripción</label>
          <textarea 
            id="description" 
            v-model="formData.description" 
            rows="3"
            placeholder="Escribe las características o detalles del producto..."
          ></textarea>
        </div>

        <!-- URL de Imagen -->
        <div class="form-group">
          <label for="imageUrl">URL de Imagen</label>
          <input 
            type="text" 
            id="imageUrl" 
            v-model="formData.imageUrl" 
            :class="{ 'input-error': errors.imageUrl }"
            placeholder="http://ejemplo.com/imagen.jpg"
          />
          <span v-if="errors.imageUrl" class="error-msg">{{ errors.imageUrl }}</span>
          
          <!-- Vista previa de imagen pequeña -->
          <div v-if="formData.imageUrl && !errors.imageUrl" class="img-preview">
            <img :src="formData.imageUrl" alt="Vista previa" @error="errors.imageUrl = 'No se pudo cargar la imagen'" />
          </div>
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <router-link to="/" class="btn-cancel">Cancelar</router-link>
          <button type="submit" class="btn-submit" :disabled="isSubmitting">
            {{ isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Producto' : 'Crear Producto') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  display: flex;
  justify-content: center;
  padding: 2rem 0 5rem;
}

.form-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 32px;
  padding: 3.5rem;
  width: 100%;
  max-width: 700px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(226, 232, 240, 0.8);
}

@media (max-width: 768px) {
  .form-card {
    padding: 2rem;
  }
}

.form-header {
  margin-bottom: 2.5rem;
  text-align: center;
}

.form-header h1 {
  font-size: 2.25rem;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 0.5rem;
}

.form-header p {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
}

.alert-error {
  background: #fee2e2;
  border: 1px solid #f87171;
  color: #b91c1c;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  font-weight: 600;
}

.product-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-row {
  display: flex;
  gap: 1.5rem;
}

.half {
  flex: 1;
}

@media (max-width: 640px) {
  .form-row {
    flex-direction: column;
    gap: 1.5rem;
  }
}

label {
  font-weight: 700;
  color: #334155;
  font-size: 0.95rem;
}

.required {
  color: #ef4444;
}

input, select, textarea {
  padding: 0.85rem 1rem;
  border-radius: 14px;
  border: 1px solid #cbd5e1;
  background: #f8fafc;
  font-size: 1rem;
  color: #0f172a;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
}

input:focus, select:focus, textarea:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
}

.input-error {
  border-color: #ef4444 !important;
  background: #fef2f2 !important;
}

.error-msg {
  color: #ef4444;
  font-size: 0.85rem;
  font-weight: 600;
}

.img-preview {
  margin-top: 1rem;
  height: 120px;
  width: 120px;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #cbd5e1;
}

.img-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel {
  flex: 1;
  text-align: center;
  padding: 1rem;
  background: #f1f5f9;
  color: #64748b;
  text-decoration: none;
  border-radius: 16px;
  font-weight: 700;
  transition: background 0.2s, color 0.2s;
}

.btn-cancel:hover {
  background: #e2e8f0;
  color: #334155;
}

.btn-submit {
  flex: 2;
  padding: 1rem;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  border: none;
  border-radius: 16px;
  font-weight: 800;
  font-size: 1.05rem;
  cursor: pointer;
  box-shadow: 0 10px 15px -3px rgba(139, 92, 246, 0.3);
  transition: transform 0.2s, box-shadow 0.2s;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 15px 20px -3px rgba(139, 92, 246, 0.4);
}

.btn-submit:disabled {
  background: #cbd5e1;
  box-shadow: none;
  cursor: not-allowed;
}
</style>
