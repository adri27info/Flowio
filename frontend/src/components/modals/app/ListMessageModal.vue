<template>
    <div v-if="action == 'listMessage'" class="modal fade" id="listMessageModal" tabindex="-1" data-bs-backdrop="static"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="d-flex flex-row justify-content-between align-items-center bg-white 
                    border-bottom border-dark border-2 p-2">
                    <div class="logo_width_modal">
                        <img :src="storeApp.getDefaultLogoImageUrl" alt="Flowio Logo" class="w-100" />
                    </div>
                    <v-icon name="io-close-outline" animation="spin" hover scale="1.5" fill="black"
                        data-bs-dismiss="modal" />
                </div>
                <div class="modal-body text-center border-bottom border-dark border-2 p-4">
                    <p v-if="storeApp.getMsgModal">
                        {{ storeApp.getMsgModal }}
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary m-auto w-50" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import appStore from "@/stores/general/appStore";
import { useModalWatcher } from "@/composables/useModalWatcher";

defineProps({
    action: {
        type: String,
        required: true,
    }
});

const { resetAndCloseModal } = useModalWatcher();
const storeApp = appStore();
const actionEntity = "listMessage"
const modalEntity = `${actionEntity}Modal`

resetAndCloseModal({
    action: actionEntity,
    modalId: modalEntity,
})
</script>

<style scoped></style>
