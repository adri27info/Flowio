<template>
    <h5 class="text-center mt-2">Delete your board</h5>
    <hr class="mb-4" />
    <div class="container-board-delete w-100 d-flex flex-column justify-content-center
        align-items-center gap-3">
        <h5 class="text-center mb-4 fw-bold">Are you sure you want to delete this board? </h5>
        <div class="w-100 d-flex flex-column flex-sm-row gap-3">
            <button type="button" class="btn btn-secondary w-75 d-block m-auto 
                btnCancel" data-bs-dismiss="modal">
                Cancel
            </button>
            <button type="button" class="btn btn-danger w-75 d-block m-auto
                btnDeleteBoard" @click="deleteBoard">
                Delete
            </button>
        </div>
        <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
            <template #response-api>
                <p :class="storeApp.getResponseApi('board.delete').class" class="w-100 text-center fw-bold mt-4 mb-0">
                    {{ storeApp.getResponseApi('board.delete').message }}
                </p>
            </template>
        </ResponseApiComponent>
    </div>
</template>

<script setup>
import { watch, computed } from "vue";
import { useLoading } from '@/composables/useLoading';
import appStore from '@/stores/general/appStore';
import workspaceStore from "@/stores/workspace/workspaceStore";
import boardStore from "@/stores/board/boardStore";
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading, withLoading } = useLoading();
const storeApp = appStore()
const storeWorkspace = workspaceStore()
const storeBoard = boardStore()
const entity = "board.delete"

const boardDeleted = computed(() => storeApp.responseApi.board.delete.message);
const board = computed(() => storeApp.responseApi.board.retrieve.message);

watch(boardDeleted, (newValue) => {
    if (newValue) {
        const btnDeleteBoard = document.querySelector("button.btnDeleteBoard");
        if (btnDeleteBoard) btnDeleteBoard.classList.add("disabled");

        storeApp.timeout.setCustomTimeout(() => {
            const modalObj = storeApp.getModalObj
            if (modalObj) {
                modalObj.hide()
                storeApp.setModalObj("")
            }
            storeApp.redirect.redirectWithDelay({
                routeName: "workspace-detail",
                delay: 1000,
                closeModal: true,
                action: "deleteBoard",
                workspaceId: board.value.workspace_id,
            })
            storeWorkspace.getWorkspaces()
            storeApp.modalRestore.restorePageAfterModal();
        }, 1000);
    }
});

const deleteBoard = async () => {
    await withLoading(async () => {
        await storeBoard.deleteBoard(storeBoard.getBoardId)
    });
}
</script>

<style scoped>
div.container-board-delete {
    max-width: 600px;
    width: 90%;
}
</style>