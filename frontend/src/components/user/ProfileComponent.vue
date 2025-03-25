<template>
    <div class="w-100 p-2">
        <div v-if="dataUser && Object.keys(dataUser).length > 0" class="container-profile d-flex flex-column 
            justify-content-center align-items-center gap-3 border border-2 
            border-dark rounded mt-4 mx-auto mb-4">
            <h4 class="w-100 mt-4 text-center">Profile of the user</h4>
            <img class="mt-4 mb-4 h-auto object-fit-cover rounded-circle" :src="dataUser.attachment"
                alt="User attachment">
            <div class="p-3">
                <p class="d-flex flex-column text-center gap-2">
                    <strong>Name: </strong>
                    {{ dataUser.name }} {{ dataUser.surnames }}
                </p>
                <hr />
                <p class="d-flex flex-column text-center gap-2">
                    <strong>Email:</strong>
                    {{ dataUser.email }}
                </p>
                <hr />
                <p class="d-flex flex-column text-center gap-2">
                    <strong>Created at:</strong>
                    {{ formatDate(dataUser.created_at) }}
                </p>
                <hr />
                <p class="d-flex flex-column text-center gap-2">
                    <strong>Role:</strong>
                    {{ getRoleName() }}
                </p>
                <hr />
                <button type="button" class="btn btn-primary text-white m-auto mt-4 d-block btnDeleteProfile"
                    @click="editProfile">
                    Edit profile
                </button>
                <button type="button" class="btn btn-danger text-white m-auto mt-4 d-block 
                            btnEditProfile" @click="deleteProfile">
                    Delete profile
                </button>
            </div>
            <ModalComponent :showModal="storeApp.getModal" :action="storeApp.getActionModal" />
        </div>
        <div v-else class="mt-5 p-2 text-center">
            <h4>No user information</h4>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import userStore from "@/stores/user/userStore";
import appStore from "@/stores/general/appStore";
import ModalComponent from '@/components/modals/ModalComponent.vue';

const storeUser = userStore();
const storeApp = appStore();

const dataUser = computed(() => storeUser.getUser);

const editProfile = () => {
    storeApp.setModal({ value: true, action: "editUser" });
}

const deleteProfile = () => {
    storeApp.setModal({ value: true, action: "deleteUser" });
}

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
}

const getRoleName = () => {
    return storeApp.getRoleUser
}
</script>

<style scoped>
div.container-profile {
    max-width: 500px;
}

img {
    width: 200px;
    height: 200px !important;
}

button.btnEditProfile,
button.btnDeleteProfile {
    width: 250px;
}
</style>
