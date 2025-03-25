<template>
  <AppLayout>
    <template #main-content>
      <router-view />
    </template>
  </AppLayout>
</template>

<script setup>
import AppLayout from '@/components/layouts/AppLayout.vue';
</script>

<style scoped></style>
