<template>
    <div v-if="action == 'retrieveBoard'" class="modal fade" id="retrieveBoardModal" tabindex="-1"
        data-bs-backdrop="static" aria-hidden="true">
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
                    <RetrieveBoardComponent />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useModalWatcher } from "@/composables/useModalWatcher";
import appStore from "@/stores/general/appStore";
import RetrieveBoardComponent from "@/components/board/RetrieveBoardComponent.vue";

defineProps({
    action: {
        type: String,
        required: true,
    }
});

const { resetAndCloseModal } = useModalWatcher();
const storeApp = appStore()
const actionEntity = "retrieveBoard"
const modalEntity = `${actionEntity}Modal`
const entity = "board.retrieve"

resetAndCloseModal({
    action: actionEntity,
    modalId: modalEntity,
    entity: entity,
    resetEntityApi: false
})
</script>

<style scoped></style>