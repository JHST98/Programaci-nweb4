import { ref } from 'vue';

export function useApi(url, options = {}) {
  const data = ref(null);
  const loading = ref(false);
  const error = ref(null);

  // Se permite pasar retries en las opciones. Por defecto será 1.
  const maxRetries = options.retries !== undefined ? options.retries : 1;
  let abortController = null;

  const execute = async (customOptions = {}, retryCount = 0) => {
    loading.value = true;
    error.value = null;

    // Crear un nuevo AbortController para permitir cancelación
    abortController = new AbortController();
    const fetchOptions = {
      ...options,
      ...customOptions,
      signal: abortController.signal
    };

    try {
      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      data.value = await response.json();
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Petición cancelada:', url);
        // No marcamos error de cara al usuario si fue cancelado a propósito
        return;
      }

      if (retryCount < maxRetries) {
        console.warn(`Reintentando petición a ${url}... (${retryCount + 1}/${maxRetries})`);
        return execute(customOptions, retryCount + 1);
      } else {
        error.value = err.message || 'Error desconocido al procesar la petición';
      }
    } finally {
      loading.value = false;
    }
  };

  const cancel = () => {
    if (abortController) {
      abortController.abort();
    }
  };

  return { data, loading, error, execute, cancel };
}
