<template>
    <header class="w-100 bg-light p-2 border-bottom border-dark border-2">
        <div class="d-flex w-100 flex-column justify-content-center align-items-center">
            <router-link :to="{ name: 'login' }" class="logo_width mb-3">
                <img :src="storeApp.getDefaultLogoImageUrl" alt="Flowio Logo" class="w-100" />
            </router-link>
            <div class="w-50 rounded d-flex flex-column flex-sm-row 
                justify-content-around align-items-center p-2 gap-2">
                <div class="d-flex w-100 gap-2 justify-content-center align-items-center">
                    <v-icon name="md-login-round" scale="1" fill="black" />
                    <router-link :to="{ name: 'login' }" class="text-black text-decoration-none">
                        Login
                    </router-link>
                </div>
                <div class="d-flex w-100 gap-2 justify-content-center align-items-center">
                    <v-icon name="hi-newspaper" scale="1" fill="black" />
                    <router-link :to="{ name: 'register' }" class="text-black text-decoration-none">
                        Register
                    </router-link>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup>
import appStore from "@/stores/general/appStore";

const storeApp = appStore()
</script>

<style scoped></style>