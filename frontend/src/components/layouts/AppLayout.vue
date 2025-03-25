<template>
    <component :is="currentHeader" />
    <MainLayout>
        <template #main-content>
            <slot name="main-content" />
        </template>
    </MainLayout>
    <FooterLayout />
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getPreviousRoute } from "@/router";

import MainLayout from '@/components/layouts/MainLayout.vue';
import FooterLayout from '@/components/layouts/FooterLayout.vue';
import HeaderLoginLayout from '@/components/layouts/HeaderLoginLayout.vue';
import HeaderAppLayout from '@/components/layouts/HeaderAppLayout.vue';
import userStore from "@/stores/user/userStore";
import appStore from "@/stores/general/appStore";
import router from '@/router';

const route = useRoute();
const storeUser = userStore()
const previousRoute = getPreviousRoute()
const storeApp = appStore()

const currentHeader = computed(() => {
    const authRoutes = ['login', 'register'];
    if (authRoutes.includes(route.name) || (!storeUser.getToken && !authRoutes.includes(previousRoute?.name))) {
        return HeaderLoginLayout;
    }
    return HeaderAppLayout;
});

watch(() => storeUser.isAuthenticated, (isAuthenticated) => {
    if (!isAuthenticated && route.name !== 'login') {
        router.push({ name: 'login' });
    }
});

router.beforeEach(() => {
    storeApp.setEntity("")
    storeApp.setEntity("workspace.list")
});
</script>

<style scoped></style>
