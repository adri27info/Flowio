<template>
    <h5 class="text-center mt-2">Delete your workspace</h5>
    <hr class="mb-4" />
    <div class="container-workspace-delete w-100 d-flex flex-column justify-content-center
        align-items-center gap-3">
        <h5 class="text-center mb-4 fw-bold">Are you sure you want to delete this workspace? </h5>
        <div class="w-100 d-flex flex-column flex-sm-row gap-3">
            <button type="button" class="btn btn-secondary w-75 d-block m-auto 
                btnCancel" data-bs-dismiss="modal">
                Cancel
            </button>
            <button type="button" class="btn btn-danger w-75 d-block m-auto
                btnDeleteWorkspace" @click="deleteWorkspace">
                Delete
            </button>
        </div>
        <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
            <template #response-api>
                <p :class="storeApp.getResponseApi('workspace.delete').class"
                    class="w-100 text-center fw-bold mt-4 mb-0">
                    {{ storeApp.getResponseApi('workspace.delete').message }}
                </p>
            </template>
        </ResponseApiComponent>
    </div>
</template>

<script setup>
import { watch, computed } from "vue";
import { useLoading } from '@/composables/useLoading';
import appStore from '@/stores/general/appStore';
import workspaceStore from '@/stores/workspace/workspaceStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading, withLoading } = useLoading();
const storeApp = appStore()
const storeWorkspace = workspaceStore()
const workspaceDeleted = computed(() => storeApp.responseApi.workspace.delete.message);
const entity = "workspace.delete"

watch(workspaceDeleted, (newValue) => {
    if (newValue) {
        const btnDeleteWorkspace = document.querySelector("button.btnDeleteWorkspace");
        if (btnDeleteWorkspace) btnDeleteWorkspace.classList.add("disabled");

        storeApp.timeout.setCustomTimeout(() => {
            const modalObj = storeApp.getModalObj
            if (modalObj) {
                modalObj.hide()
                storeApp.setModalObj("")
            }
            storeApp.redirect.redirectWithDelay({
                routeName: "workspaces",
                delay: 0,
                closeModal: true,
                action: "deleteWorkspace"
            })
            storeApp.modalRestore.restorePageAfterModal();
        }, 1000);
    }
});

const deleteWorkspace = async () => {
    await withLoading(async () => {
        await storeWorkspace.deleteWorkspace(storeWorkspace.getWorkspaceId)
    });
}
</script>

<style scoped>
div.container-workspace-delete {
    max-width: 600px;
    width: 90%;
}
</style>