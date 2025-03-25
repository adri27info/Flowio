<template>
    <div v-if="action == 'editBoard'" class="modal fade" id="editBoardModal" tabindex="-1" data-bs-backdrop="static"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal_header d-flex flex-row justify-content-between align-items-center bg-white 
                    border-bottom border-dark border-2 p-2">
                    <div class="logo_width_modal">
                        <img :src="storeApp.getDefaultLogoImageUrl" alt="Flowio Logo" class="w-100" />
                    </div>
                    <v-icon name="io-close-outline" animation="spin" hover scale="1.5" fill="black"
                        data-bs-dismiss="modal" @click="handleModalClose" />
                </div>
                <div class="modal-body">
                    <EditBoardComponent ref="editBoardComponent" @clearForm="clearFormEditBoard" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useModalWatcher } from "@/composables/useModalWatcher";
import appStore from "@/stores/general/appStore";
import formStore from '@/stores/general/formStore';
import EditBoardComponent from "@/components/forms/board/EditBoardComponent.vue";

defineProps({
    action: {
        type: String,
        required: true,
    },
});

const { resetAndCloseModal, dynamicResetAndClear } = useModalWatcher();
const storeApp = appStore()
const storeForm = formStore();
const editBoardComponent = ref(null);
const actionEntity = "editBoard"
const modalEntity = `${actionEntity}Modal`
const entity = "board.update"

resetAndCloseModal({
    action: actionEntity,
    modalId: modalEntity,
    entity: entity
})

const handleModalClose = () => {
    if (editBoardComponent.value) {
        editBoardComponent.value.resetStructureListValues();
    }
}

const clearFormEditBoard = (resetStructureListValues) => {
    storeForm.setFormToReset(actionEntity)
    storeApp.timeout.setCustomTimeout(() => {
        dynamicResetAndClear(actionEntity, null, entity, true, resetStructureListValues)
    }, 1000);
}
</script>

<style scoped></style>