import { ref } from "vue";

export function useLoading() {
  const loading = ref(false);

  const withLoading = async (action) => {
    loading.value = true;
    try {
      await action();
    } finally {
      loading.value = false;
    }
  };

  return { loading, withLoading };
}
