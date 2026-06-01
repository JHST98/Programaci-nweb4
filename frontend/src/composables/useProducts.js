import { ref, computed } from 'vue';
import { useApi } from './useApi';

export function useProducts() {
  const { 
    data: rawProducts, 
    loading: loadingProducts, 
    error: errorProducts, 
    execute: executeProducts,
    cancel: cancelProducts
  } = useApi('/api/products');

  const { 
    data: rawCategories, 
    loading: loadingCategories, 
    error: errorCategories, 
    execute: executeCategories,
    cancel: cancelCategories
  } = useApi('/api/categories');

  // Estado global compuesto
  const isLoading = computed(() => loadingProducts.value || loadingCategories.value);
  const globalError = computed(() => errorProducts.value || errorCategories.value);
  
  // Garantizar arreglos vacíos si data es nula
  const products = computed(() => rawProducts.value || []);
  const categories = computed(() => rawCategories.value || []);

  const fetchAll = async () => {
    // Ejecutamos ambas peticiones en paralelo
    await Promise.all([
      executeProducts(),
      executeCategories()
    ]);
  };

  const cancelAll = () => {
    cancelProducts();
    cancelCategories();
  };

  return {
    products,
    categories,
    isLoading,
    error: globalError,
    fetchAll,
    cancelAll
  };
}
