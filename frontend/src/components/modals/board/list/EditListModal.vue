<template>
    <div v-if="action == 'editList'" class="modal fade" id="editListModal" tabindex="-1" data-bs-backdrop="static"
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
                    <EditListComponent @clearForm="clearFormEditList" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useModalWatcher } from "@/composables/useModalWatcher";
import appStore from "@/stores/general/appStore";
import formStore from '@/stores/general/formStore';
import EditListComponent from "@/components/forms/board/list/EditListComponent.vue";

defineProps({
    action: {
        type: String,
        required: true,
    },
});

const { resetAndCloseModal, dynamicResetAndClear } = useModalWatcher();
const storeApp = appStore()
const storeForm = formStore();
const actionEntity = "editList"
const modalEntity = `${actionEntity}Modal`
const entity = "list.update"

resetAndCloseModal({
    action: actionEntity,
    modalId: modalEntity,
    entity: entity
})

const clearFormEditList = () => {
    storeForm.setFormToReset(actionEntity)
    storeApp.timeout.setCustomTimeout(() => {
        dynamicResetAndClear(actionEntity, null, entity, true)
    }, 1000);
}
</script>

<style scoped></style>