<template>
    <div v-if="loading">
        <div v-if="spinnerWrapper" class="position-relative">
            <div class="spinner-border text-primary d-block m-auto mb-4 mt-2 position-absolute top-0 start-50"></div>
        </div>
        <div v-else class="spinner-border text-primary d-block m-auto mb-4 mt-2">
        </div>
    </div>

    <div v-else-if="storeApp.getResponseApi(entity)" class="w-100 mb-4 container-response-api">
        <slot name="response-api" />
    </div>
</template>

<script setup>
import appStore from "@/stores/general/appStore";

defineProps({
    loading: Boolean,
    entity: {
        type: [String, Boolean],
    },
    spinnerWrapper: {
        type: Boolean,
        required: false,
    },
});

const storeApp = appStore()
</script>

<style scoped></style>