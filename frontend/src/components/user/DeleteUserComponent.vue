<template>
    <h5 class="text-center mt-2">Delete your profile</h5>
    <hr class="mb-4" />
    <div class="container-user-delete w-100 d-flex flex-column justify-content-center
        align-items-center gap-3">
        <h5 class="text-center mb-4 fw-bold">Are you sure you want to delete your profile? </h5>
        <div class="w-100 d-flex flex-column flex-sm-row gap-3">
            <button type="button" class="btn btn-secondary w-75 d-block m-auto 
                btnCancel" data-bs-dismiss="modal">
                Cancel
            </button>
            <button type="button" class="btn btn-danger w-75 d-block m-auto
                btnDeleteUser" @click="deleteUser">
                Delete
            </button>
        </div>
        <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
            <template #response-api>
                <p :class="storeApp.getResponseApi('user.delete').class" class="w-100 text-center fw-bold mt-4 mb-0">
                    {{ storeApp.getResponseApi('user.delete').message }}
                </p>
            </template>
        </ResponseApiComponent>
    </div>
</template>

<script setup>
import { watch, computed } from "vue"
import { useLoading } from '@/composables/useLoading';
import appStore from '@/stores/general/appStore';
import userStore from "@/stores/user/userStore";
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading, withLoading } = useLoading();
const storeApp = appStore()
const storeUser = userStore();
const entity = "user.delete"

const userDelete = computed(() => storeApp.responseApi.user.delete.message);

watch(userDelete, (newValue) => {
    if (newValue) {
        const btnDeleteUser = document.querySelector("button.btnDeleteUser");
        if (btnDeleteUser) btnDeleteUser.classList.add("disabled");
    }

    storeApp.timeout.setCustomTimeout(() => {
        const modalObj = storeApp.getModalObj
        if (modalObj) {
            modalObj.hide()
            storeApp.setModalObj("")
        }
        storeUser.clearSession();
        storeApp.modalRestore.restorePageAfterModal();
    }, 1000);
});

const deleteUser = async () => {
    await withLoading(async () => {
        await storeUser.deleteUser()
    });
}
</script>

<style scoped>
div.container-user-delete {
    max-width: 600px;
    width: 90%;
}
</style>