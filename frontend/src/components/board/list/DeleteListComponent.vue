<template>
    <h5 class="text-center mt-2">Delete your list</h5>
    <hr class="mb-4" />
    <div class="container-list-delete w-100 d-flex flex-column justify-content-center
        align-items-center gap-3">
        <h5 class="text-center mb-4 fw-bold">Are you sure you want to delete this list? </h5>
        <div class="w-100 d-flex flex-column flex-sm-row gap-3">
            <button type="button" class="btn btn-secondary w-75 d-block m-auto 
                btnCancel" data-bs-dismiss="modal">
                Cancel
            </button>
            <button type="button" class="btn btn-danger w-75 d-block m-auto
                btnDeleteList" @click="deleteList">
                Delete
            </button>
        </div>
        <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
            <template #response-api>
                <p :class="storeApp.getResponseApi('list.delete').class" class="w-100 text-center fw-bold mt-4 mb-0">
                    {{ storeApp.getResponseApi('list.delete').message }}
                </p>
            </template>
        </ResponseApiComponent>
    </div>
</template>

<script setup>
import { watch, computed } from "vue";
import { useLoading } from '@/composables/useLoading';
import { useRoute } from "vue-router";
import appStore from '@/stores/general/appStore';
import boardStore from "@/stores/board/boardStore";
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading, withLoading } = useLoading();
const storeApp = appStore()
const storeBoard = boardStore()
const route = useRoute()
const entity = "list.delete"

const listDeleted = computed(() => storeApp.responseApi.list.delete.message);

watch(listDeleted, (newValue) => {
    if (newValue) {
        const btnDeleteList = document.querySelector("button.btnDeleteList");
        if (btnDeleteList) btnDeleteList.classList.add("disabled");

        storeApp.timeout.setCustomTimeout(() => {
            const modalObj = storeApp.getModalObj
            if (modalObj) {
                modalObj.hide()
                storeApp.setModalObj("")
            }
            storeApp.redirect.redirectWithDelay({
                routeName: "board-detail",
                delay: 1000,
                closeModal: true,
                action: "deleteList",
                workspaceId: route.params.workspaceId,
                boardId: storeBoard.getBoardId
            })
            storeBoard.retrieveBoard(storeBoard.getBoardId)
            storeApp.modalRestore.restorePageAfterModal();
        }, 1000);
    }
});

const deleteList = async () => {
    await withLoading(async () => {
        await storeBoard.deleteList(storeBoard.getListId)
    });
}
</script>

<style scoped>
div.container-list-delete {
    max-width: 600px;
    width: 90%;
}
</style>