<template>
    <h5 class="text-center mt-2">Edit your card</h5>
    <hr class="mb-4" />
    <form class="form-update-card w-100 bg-white p-2" @submit.prevent="handleForm" enctype="multipart/form-data">
        <div class="d-flex flex-column justify-content-center align-items-center mb-4">
            <label for="title" class="form-label fw-bold text-center">
                Title
                <span class="text-danger">*</span>
            </label>
            <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="title"
                placeholder="Enter the title" v-model="storeForm.formData.editCard.title"
                @input="storeForm.validateTitle('editCard')">
            <p class="w-100 text-center text-danger mt-2 fw-bold">
                {{ storeForm.formErrors.editCard.title }}
            </p>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center mb-4">
            <label for="description" class="form-label fw-bold">
                Description
            </label>
            <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="description"
                placeholder="Enter the description" v-model="storeForm.formData.editCard.description">
        </div>
        <p class="w-100 text-center showErrorForm fw-bold mb-5 text-danger">
            {{ storeForm.formErrors.editCard.form }}
        </p>
        <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
            <template #response-api>
                <p :class="storeApp.getResponseApi('card.update').class" class="w-100 text-center fw-bold mt-3 mb-3">
                    {{ storeApp.getResponseApi('card.update').message }}
                </p>
            </template>
        </ResponseApiComponent>
        <div class="modal-container-buttons d-flex flex-row justify-content-center
            align-items-center gap-2 mt-5">
            <button type="button" class="btn btn-secondary w-75 d-block m-auto" data-bs-dismiss="modal"
                @click="emitEvent">
                Close
            </button>
            <button type="submit" class="btn btn-warning w-75 d-block m-auto btnEditCard">Edit</button>
        </div>
    </form>
</template>

<script setup>
import { useLoading } from '@/composables/useLoading';
import { useFormHandler } from "@/composables/useFormHandler";
import { useRoute } from 'vue-router';
import appStore from '@/stores/general/appStore';
import userStore from '@/stores/user/userStore';
import formStore from '@/stores/general/formStore';
import boardStore from '@/stores/board/boardStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading, withLoading } = useLoading();
const { handleFormSubmit } = useFormHandler(withLoading);
const emit = defineEmits(['clearForm']);
const storeApp = appStore()
const storeUser = userStore()
const storeForm = formStore()
const storeBoard = boardStore()
const route = useRoute();
const entity = "card.update"

const emitEvent = () => {
    emit('clearForm');
}

const getFormDataTrace = () => {
    const formDataTrace = new FormData();
    formDataTrace.append("user_id", storeUser.getIdUser);
    formDataTrace.append("card_id", storeBoard.getCardId);
    formDataTrace.append("description", "Edit this card");
    return formDataTrace
}

const handleForm = async (e) => {
    const classList = e.target.classList;
    const formHandlers = {
        "form-update-card": {
            fields: ["title"],
            action: () => storeBoard.updateCard(
                storeBoard.getCardId,
                storeForm.fillFormData("editCard")
            ),
            btnName: "btnEditCard",
            keyForm: "editCard",
            entity: "card.update",
            errorMessages: () => storeForm.errorValidations.editCard.form.requiredFields,
            optionsRedirection: {
                routeName: "board-detail",
                delay: 1000,
                closeModal: true,
                action: "editCard",
                workspaceId: route.params.workspaceId,
                boardId: storeBoard.getBoardId
            },
            emitEvent: { nameEvent: "clearForm" },
            extraActions: [
                () => storeBoard.createTrace(getFormDataTrace()),
                () => storeBoard.retrieveBoard(storeBoard.getBoardId),
            ]
        },
    };

    const matchingForm = Object.keys(formHandlers).find(cls => classList.contains(cls));
    if (matchingForm) {
        const formConfig = formHandlers[matchingForm];
        await handleFormSubmit(formConfig, emit);
    }
};
</script>

<style scoped>
form.form-update-card {
    max-width: 600px;
}
</style>