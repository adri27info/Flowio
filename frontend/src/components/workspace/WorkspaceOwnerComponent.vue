<template>
    <div class="w-100 p-2">
        <div v-if="dataUser && Object.keys(dataUser).length > 0" class="container-workspace-board-owner
            d-flex flex-column justify-content-center align-items-center gap-3  mx-auto">
            <div class="container-workspace-board-owner-header w-100 p-2 text-center mb-2">
                <h4 class="d-block text-center mb-4">Owner</h4>
                <p class="p-0 m-0">
                    Workspace owner can see all boards visible to the workspace, join them, and create new
                    boards.
                </p>
            </div>
            <div class="container-workspace-board-owner-body w-100 d-flex flex-column
                flex-lg-row justify-content-center align-items-center gap-5 mt-4">
                <div class="container-workspace-board-owner-body__image">
                    <img class="mt-4 mb-4 h-auto object-fit-cover rounded-circle" :src="dataUser.attachment">
                </div>
                <div class="d-flex flex-column justify-content-center align-items-center">
                    <p class="d-flex flex-column text-center gap-2">
                        <strong>Name: </strong>
                        {{ dataUser.name }} {{ dataUser.surnames }}
                    </p>
                    <hr class="w-100" />
                    <p class="d-flex flex-column text-center gap-2">
                        <strong>Email:</strong>
                        {{ dataUser.email }}
                    </p>
                    <hr class="w-100" />
                    <p class="d-flex flex-column text-center gap-2">
                        <strong>Created at:</strong>
                        {{ formatDate(dataUser.created_at) }}
                    </p>
                </div>
            </div>
        </div>
        <div v-else class="mt-5 p-2 text-center">
            <h4>No user information</h4>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import userStore from "@/stores/user/userStore";

const storeUser = userStore();

const dataUser = computed(() => storeUser.getUser);

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
}
</script>

<style scoped>
div.container-workspace-board-owner-body__image img {
    width: 200px;
    height: 200px !important;
}
</style>
