<template>
    <h5 class="text-center mt-2">Create new board</h5>
    <hr class="mb-4" />
    <div class="w-100 d-flex flex-column flex-lg-row justify-content-center 
        align-items-center gap-3">
        <form class="form-create-board bg-white p-3" @submit.prevent="handleForm" enctype="multipart/form-data">
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="name" class="form-label fw-bold text-center">Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="name"
                    placeholder="Enter the name" v-model="storeForm.formData.createBoard.name"
                    @input="storeForm.validateName('createBoard')">
                <p class="w-100 text-center text-danger mt-2 fw-bold">
                    {{ storeForm.formErrors.createBoard.name }}
                </p>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="description" class="form-label fw-bold text-center">Description <span
                        class="text-danger">*</span></label>
                <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="description"
                    placeholder="Enter the description" v-model="storeForm.formData.createBoard.description"
                    @input="storeForm.validateDescription('createBoard')">
                <p class="w-100 text-center text-danger mt-2 fw-bold">
                    {{ storeForm.formErrors.createBoard.description }}
                </p>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="workspace" class="form-label fw-bold text-center">
                    Workspace
                    <span class="text-danger">*</span>
                </label>
                <div class="board-workspaces d-flex flex-column justify-content-center gap-2 w-100 mt-3">
                    <div v-for="(workspace, index) in workspaces" :key="workspace.id">
                        <label class="d-flex flex-row justify-content-center align-items-center gap-3">
                            <input type="radio" v-model="storeForm.formData.createBoard.workspace_id"
                                :value="workspace.id" @change="handleWorkspaceChange(workspace.id)" />
                            <div class="board-workspace-detail-header d-flex flex-row 
                                justify-content-between align-items-center gap-3">
                                <p class="text-center p-0 m-0">
                                    {{ getTruncatedName(workspace.name, 10) }}
                                </p>
                                <div class="board-workspace-detail-header-title d-flex flex-column 
                                    justify-content-center align-items-center text-center
                                    text-white rounded-circle border border-2 border-dark" id="workspace-title-board"
                                    :style="getStyles(workspace)">
                                    <p class="d-block fw-bold m-auto p-0">
                                        {{ getFirstLetter(workspace.name) }}
                                    </p>
                                </div>
                            </div>
                        </label>
                        <div v-if="index !== workspaces.length - 1" class="custom-hr w-100 my-3"></div>
                    </div>
                </div>
                <p class="w-100 text-center text-danger mt-2 fw-bold">
                    {{ storeForm.formErrors.createBoard.workspace_id }}
                </p>
            </div>
            <p class="w-100 text-center showErrorForm fw-bold mb-5 text-danger">
                {{ storeForm.formErrors.createBoard.form }}
            </p>
            <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
                <template #response-api>
                    <p :class="storeApp.getResponseApi('board.create').class" class="w-100 text-center fw-bold">
                        {{ storeApp.getResponseApi('board.create').message }}
                    </p>
                </template>
            </ResponseApiComponent>
            <div class="modal-container-buttons d-flex flex-row justify-content-center
                align-items-center gap-2 mt-5">
                <button type="button" class="btn btn-secondary w-75 d-block m-auto" data-bs-dismiss="modal">
                    Close
                </button>
                <button type="submit" class="btn btn-primary w-75 d-block m-auto btnCreateBoard">
                    Create
                </button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useFormHandler } from "@/composables/useFormHandler";
import { useUtilsWorkspace } from '@/composables/useUtilsWorkspace';
import appStore from '@/stores/general/appStore';
import formStore from '@/stores/general/formStore';
import workspaceStore from '@/stores/workspace/workspaceStore';
import boardStore from '@/stores/board/boardStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading, withLoading } = useLoading();
const { handleFormSubmit } = useFormHandler(withLoading);
const { getFirstLetter, getStyles, getTruncatedName } = useUtilsWorkspace();
const emit = defineEmits(['clearForm']);
const storeApp = appStore()
const storeForm = formStore()
const storeWorkspace = workspaceStore()
const storeBoard = boardStore()
const entity = "board.create"

const workspaces = computed(() => storeApp.responseApi.workspace.list.message);

const handleWorkspaceChange = (workspaceId) => {
    storeWorkspace.setWorkspaceId(workspaceId)
    storeForm.validateWorkspace('createBoard');
}

const handleForm = async (e) => {
    const classList = e.target.classList;
    const formHandlers = {
        "form-create-board": {
            fields: ["name", "description", "workspace_id"],
            action: () => storeBoard.createBoard(storeForm.fillFormData("createBoard")),
            btnName: "btnCreateBoard",
            keyForm: "createBoard",
            entity: "board.create",
            errorMessages: () => storeForm.errorValidations.createBoard.form.requiredFields,
            optionsRedirection: {
                routeName: "workspace-detail",
                delay: 1000,
                closeModal: true,
                action: "createBoard",
                workspaceId: storeWorkspace.getWorkspaceId,
            },
            emitEvent: { nameEvent: "clearForm" },
        },
    };

    const matchingForm = Object.keys(formHandlers).find(cls => classList.contains(cls));
    if (matchingForm) {
        const formConfig = formHandlers[matchingForm];
        await handleFormSubmit(formConfig, emit);
    }
};

onMounted(async () => {
    await storeWorkspace.getWorkspaces()
})
</script>

<style scoped>
form.form-create-board {
    width: 600px;
}

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