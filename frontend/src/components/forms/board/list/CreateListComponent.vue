<template>
    <h5 class="text-center mt-2">Create new list</h5>
    <hr class="mb-4" />
    <div class="w-100 d-flex flex-column flex-lg-row justify-content-center 
        align-items-center gap-3">
        <form class="form-create-list w-100 bg-white p-3" @submit.prevent="handleForm" enctype="multipart/form-data">
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="title" class="form-label fw-bold text-center">
                    Title
                    <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="title"
                    placeholder="Enter the title" v-model="storeForm.formData.createList.title"
                    @input="storeForm.validateTitle('createList')">
                <p class="w-100 text-center text-danger mt-2 fw-bold">
                    {{ storeForm.formErrors.createList.title }}
                </p>
            </div>
            <p class="w-100 text-center showErrorForm fw-bold mb-5 text-danger">
                {{ storeForm.formErrors.createList.form }}
            </p>
            <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
                <template #response-api>
                    <p :class="storeApp.getResponseApi('list.create').class" class="w-100 text-center fw-bold">
                        {{ storeApp.getResponseApi('list.create').message }}
                    </p>
                </template>
            </ResponseApiComponent>
            <div class="modal-container-buttons d-flex flex-row justify-content-center
                align-items-center gap-2 mt-5">
                <button type="button" class="btn btn-secondary w-75 d-block m-auto" data-bs-dismiss="modal">
                    Close
                </button>
                <button type="submit" class="btn btn-primary w-75 d-block m-auto btnCreateList">
                    Create
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { useLoading } from '@/composables/useLoading';
import { useFormHandler } from "@/composables/useFormHandler";
import { useRoute } from 'vue-router';
import appStore from '@/stores/general/appStore';
import formStore from '@/stores/general/formStore';
import boardStore from '@/stores/board/boardStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading, withLoading } = useLoading();
const { handleFormSubmit } = useFormHandler(withLoading);
const emit = defineEmits(['clearForm']);
const storeApp = appStore()
const storeForm = formStore()
const storeBoard = boardStore()
const route = useRoute();
const entity = "list.create"

const handleForm = async (e) => {
    const classList = e.target.classList;
    const formHandlers = {
        "form-create-list": {
            fields: ["title"],
            action: () => storeBoard.createList(storeForm.fillFormData("createList")),
            btnName: "btnCreateList",
            keyForm: "createList",
            entity: "list.create",
            errorMessages: () => storeForm.errorValidations.createList.form.requiredFields,
            optionsRedirection: {
                routeName: "board-detail",
                delay: 1000,
                closeModal: true,
                action: "createList",
                workspaceId: route.params.workspaceId,
                boardId: storeBoard.getBoardId
            },
            emitEvent: { nameEvent: "clearForm" },
            extraActions: () => storeBoard.retrieveBoard(storeBoard.getBoardId),
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
div.custom-hr {
    height: 2px;
    background-color: #000;
}

div.board-workspace-detail-header {
    width: 170px;
}

div.board-workspace-detail-header-title {
    width: 30px;
    height: 30px;
}

@media (max-width: 991px) {
    form.form-create-board {
        width: 100%;
    }
}

@media (max-width: 600px) {}
</style>