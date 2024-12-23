<template>
    <div id="app">
        <router-view />
    </div>
</template>

<script>
import { useAuthStore } from '@/stores/useAuthStore';

export default {
  setup() {
    const authStore = useAuthStore();

    // Извикване на initializeFromStorage при стартиране
    authStore.initializeFromStorage();

    return { authStore };
  }
}
</script>
