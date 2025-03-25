<template>
    <div v-if="action == 'deleteBoard'" class="modal fade" id="deleteBoardModal" tabindex="-1" data-bs-backdrop="static"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal_header d-flex flex-row justify-content-between align-items-center bg-white 
                    border-bottom border-dark border-2 p-2">
                    <div class="logo_width_modal">
                        <img :src="storeApp.getDefaultLogoImageUrl" alt="Flowio Logo" class="w-100" />
                    </div>
                    <v-icon name="io-close-outline" animation="spin" hover scale="1.5" fill="black"
                        data-bs-dismiss="modal" />
                </div>
                <div class="modal-body">
                    <DeleteBoardComponent />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useModalWatcher } from "@/composables/useModalWatcher";
import appStore from "@/stores/general/appStore";
import DeleteBoardComponent from "@/components/board/DeleteBoardComponent.vue";

defineProps({
    action: {
        type: String,
        required: true,
    }
});

const { resetAndCloseModal } = useModalWatcher();
const storeApp = appStore()
const actionEntity = "deleteBoard"
const modalEntity = `${actionEntity}Modal`
const entity = "board.delete"

resetAndCloseModal({
    action: actionEntity,
    modalId: modalEntity,
    entity: entity
})
</script>

<style scoped></style>