<template>
    <section v-show="showModal" class="modal-container">
        <ListMessageModal :action="storeApp.getActionModal" />
        <EditUserModal :action="storeApp.getActionModal" />
        <DeleteUserModal :action="storeApp.getActionModal" />
        <CreateWorkspaceModal :action="storeApp.getActionModal" />
        <EditWorkspaceModal :action="storeApp.getActionModal" />
        <DeleteWorkspaceModal :action="storeApp.getActionModal" />
        <CreateBoardModal :action="storeApp.getActionModal" />
        <RetrieveBoardModal :action="storeApp.getActionModal" />
        <EditBoardModal :action="storeApp.getActionModal" />
        <DeleteBoardModal :action="storeApp.getActionModal" />
        <CreateListModal :action="storeApp.getActionModal" />
        <EditListModal :action="storeApp.getActionModal" />
        <DeleteListModal :action="storeApp.getActionModal" />
        <CreateCardModal :action="storeApp.getActionModal" />
        <RetrieveCardModal :action="storeApp.getActionModal" />
        <EditCardModal :action="storeApp.getActionModal" />
        <DeleteCardModal :action="storeApp.getActionModal" />
    </section>
</template>

<script setup>
import ListMessageModal from "@/components/modals/app/ListMessageModal.vue";
import EditUserModal from "@/components/modals/user/EditUserModal.vue";
import DeleteUserModal from "@/components/modals/user/DeleteUserModal.vue";
import CreateWorkspaceModal from "@/components/modals/workspace/CreateWorkspaceModal.vue";
import EditWorkspaceModal from "@/components/modals/workspace/EditWorkspaceModal.vue";
import DeleteWorkspaceModal from "@/components/modals/workspace/DeleteWorkspaceModal.vue";
import CreateBoardModal from "@/components/modals/board/CreateBoardModal.vue"
import RetrieveBoardModal from "@/components/modals/board/RetrieveBoardModal.vue";
import DeleteBoardModal from "@/components/modals/board/DeleteBoardModal.vue";
import EditBoardModal from "@/components/modals/board/EditBoardModal.vue";
import CreateListModal from "@/components/modals/board/list/CreateListModal.vue";
import EditListModal from "@/components/modals/board/list/EditListModal.vue";
import DeleteListModal from "@/components/modals/board/list/DeleteListModal.vue";
import CreateCardModal from "@/components/modals/board/card/CreateCardModal.vue";
import RetrieveCardModal from "@/components/modals/board/card/RetrieveCardModal.vue";
import EditCardModal from "@/components/modals/board/card/EditCardModal.vue";
import DeleteCardModal from "@/components/modals/board/card/DeleteCardModal.vue";
import appStore from "@/stores/general/appStore";

defineProps({
    showModal: {
        type: Boolean,
        required: true
    },
    action: {
        type: String,
        required: true,
    },
});

const storeApp = appStore();
</script>

<style scoped></style>