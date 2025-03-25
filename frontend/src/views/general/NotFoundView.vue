<template>
    <div class="mt-5 w-100 d-flex flex-column justify-content-center align-items-center p-3 gap-3">
        <h1 class="w-100 text-center">404 - Page not found</h1>
        <router-link :to="{ name: 'login' }" class="w-50 text-center  btn btn-dark text-white">
            Return back
        </router-link>
    </div>
</template>

<script setup>
</script>

<style scoped></style>