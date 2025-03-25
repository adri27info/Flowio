<template>
    <header class="w-100 bg-light p-3 border-bottom border-dark border-2">
        <div class="d-flex w-100 flex-column flex-xl-row justify-content-between 
            align-items-center gap-3 gap-md-4">
            <div class="logo_width">
                <router-link :to="{ name: 'workspaces' }" class="mb-3">
                    <img :src="storeApp.getDefaultLogoImageUrl" id="flowio" alt="Flowio Logo" class="w-100" />
                </router-link>
            </div>
            <div class="w-100 rounded d-flex flex-column flex-xl-row justify-content-center 
                align-items-center p-2 gap-3 gap-lg-4">
                <div class="w-100 d-flex flex-column flex-sm-row justify-content-evenly 
                    justify-content-xl-start align-items-center gap-3 gap-sm-5 p-2">
                    <div class="d-flex gap-2 justify-content-center align-items-center">
                        <v-icon name="bi-person-workspace" scale="1" fill="black" />
                        <router-link :to="{ name: 'workspaces' }" class="text-black text-decoration-none">
                            Workspaces
                        </router-link>
                    </div>
                    <div class="d-flex gap-2 justify-content-center align-items-center">
                        <v-icon name="hi-template" scale="1" fill="black" />
                        <router-link :to="{ name: 'structures' }" class="text-black text-decoration-none">
                            Structures
                        </router-link>
                    </div>
                </div>
                <div class="w-100 d-flex flex-row justify-content-center
                    justify-content-lg-end align-items-center gap-3">
                    <InputSearchComponent />
                    <div class="image-user position-relative d-inline-block order-1">
                        <img :src="srcProfileImage" data-bs-toggle="dropdown"
                            class="w-100 mt-1 object-fit-cover rounded-circle" aria-expanded="false" />
                        <ul class="dropdown-menu">
                            <router-link :to="{ name: 'profile' }"
                                class="text-black text-decoration-none dropdown-item">
                                Profile
                            </router-link>
                            <li><button class="dropdown-item" @click="logout">Log out</button></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <ModalComponent :showModal="storeApp.getModal" :action="storeApp.getActionModal" />
</template>

<script setup>
import { computed } from 'vue';
import userStore from "@/stores/user/userStore";
import appStore from "@/stores/general/appStore";
import router from '@/router';
import ModalComponent from '@/components/modals/ModalComponent.vue';
import InputSearchComponent from '@/components/general/InputSearchComponent.vue';

const storeUser = userStore();
const storeApp = appStore()

const srcProfileImage = computed(() => {
    return storeUser.getUser
        ? storeUser.getUser.attachment
        : storeApp.getDefaultProfileImageUrl;
});

const logout = async () => {
    storeApp.setModal({ value: false });
    await storeUser.logout()
}

router.beforeEach(async () => {
    await storeUser.retrieveUser()
});
</script>

<style scoped>
div.image-user {
    width: 55px;
}

div.image-user img {
    height: 45px;
}
</style>