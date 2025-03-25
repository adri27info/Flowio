<template>
    <h5 class="text-center mt-2">Edit your board</h5>
    <hr class="mb-4" />
    <form class="form-update-board w-100 bg-white p-2" @submit.prevent="handleForm" enctype="multipart/form-data">
        <div class="d-flex flex-column justify-content-center align-items-center mb-4">
            <label for="name" class="form-label fw-bold">Name <span class="text-danger">*</span></label>
            <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="name"
                placeholder="Enter the name" v-model="storeForm.formData.editBoard.name"
                @input="storeForm.validateName('editBoard')">
            <p class="w-100 text-center text-danger mt-2 fw-bold">
                {{ storeForm.formErrors.editBoard.name }}
            </p>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center mb-4">
            <label for="description" class="form-label fw-bold">Description <span class="text-danger">*</span></label>
            <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="description"
                placeholder="Enter the description" v-model="storeForm.formData.editBoard.description"
                @input="storeForm.validateDescription('editBoard')">
            <p class="w-100 text-center text-danger mt-2 fw-bold">
                {{ storeForm.formErrors.editBoard.description }}
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
                        <input type="radio" v-model="storeForm.formData.editBoard.workspace_id" :value="workspace.id"
                            @change="handleWorkspaceChange(workspace.id)" />
                        <div class="board-workspace-detail-header d-flex flex-row 
                                justify-content-between align-items-center gap-3">
                            <p class="text-center p-0 m-0">
                                {{ getTruncatedName(workspace.name, 10) }}
                            </p>
                            <div class="board-workspace-detail-header-title d-flex flex-column 
                                    justify-content-center align-items-center text-white
                                    rounded-circle text-center border border-2 border-dark" id="workspace-title-board"
                                :style="getStyles(workspace)">
                                <p class="d-block fw-bold m-auto p-0">
                                    {{ getFirstLetter(workspace.name) }}
                                </p>
                            </div>
                        </div>
                    </label>
                    <div v-if="index !== workspaces.length - 1" class="custom-hr w-100 my-3"></div>
                </div>
                <p class="text-center m-0 mt-3 text-dark fw-bold small">
                    When you change your workspace for other, the board will move to that workspace.
                </p>
            </div>
            <p class="w-100 text-center text-danger mt-2 fw-bold">
                {{ storeForm.formErrors.editBoard.workspace_id }}
            </p>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center gap-3 
            text-center mb-4">
            <label for="structureSelector" class="form-label fw-bold">
                Structure
            </label>
            <select class="form-select text-center" name="structureSelector" id="structureSelector"
                v-model="selectedStructureType">
                <option value="" selected>Open this select menu</option>
                <option value="default_structures">Default</option>
            </select>
            <ResponseApiComponent :loading="loadingStructures" :entity="storeApp.getEntity(entitys.structure.list)">
                <template #response-api>
                    <div v-if="structuresList.length > 0" class="structures-container w-100">
                        <div class="d-flex flex-row flex-wrap justify-content-center align-items-center 
                            gap-3">
                            <div v-for="structure in structuresList" :key="structure.id" class="structure-item"
                                :class="{ 'selected': selectedStructureId === structure.id }"
                                @click="selectStructure(structure.id)" :id="structure.id"
                                :style="{ backgroundImage: 'url(' + structure.path + ')' }">
                            </div>
                        </div>
                    </div>
                </template>
            </ResponseApiComponent>
        </div>
        <p class="w-100 text-center showErrorForm fw-bold mb-5 text-danger">
            {{ storeForm.formErrors.editBoard.form }}
        </p>
        <ResponseApiComponent :loading="loadingBoard" :entity="storeApp.getEntity(entitys.board)">
            <template #response-api>
                <p :class="storeApp.getResponseApi('board.update').class" class="w-100 text-center fw-bold mt-3 mb-3">
                    {{ storeApp.getResponseApi('board.update').message }}
                </p>
            </template>
        </ResponseApiComponent>
        <div class="modal-container-buttons d-flex flex-row justify-content-center
            align-items-center gap-2 mt-5">
            <button type="button" class="btn btn-secondary w-75 d-block m-auto" data-bs-dismiss="modal"
                @click="emitEvent">
                Close
            </button>
            <button type="submit" class="btn btn-warning w-75 d-block m-auto btnEditBoard">Edit</button>
        </div>
    </form>
</template>

<script setup>
import { onUnmounted, onMounted, computed, ref, watch } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useFormHandler } from "@/composables/useFormHandler";
import { useUtilsWorkspace } from '@/composables/useUtilsWorkspace';
import appStore from '@/stores/general/appStore';
import formStore from '@/stores/general/formStore';
import workspaceStore from '@/stores/workspace/workspaceStore';
import structureStore from '@/stores/structure/structureStore';
import boardStore from '@/stores/board/boardStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading: loadingBoard, withLoading } = useLoading();
const { loading: loadingStructures } = useLoading();
const { handleFormSubmit } = useFormHandler(withLoading);
const { getFirstLetter, getStyles, getTruncatedName } = useUtilsWorkspace();
const emit = defineEmits(['clearForm']);
const storeApp = appStore()
const storeForm = formStore()
const storeWorkspace = workspaceStore()
const storeBoard = boardStore()
const storeStructure = structureStore()
const selectedStructureId = ref(null);
const selectedStructureType = ref('');
const entitys = {
    "board": "board.update",
    "structure": {
        "list": "structure.list",
    }
}

const workspaces = computed(() => storeApp.responseApi.workspace.list.message);

const structuresList = computed(() => {
    if (selectedStructureType.value === 'default_structures') {
        return storeApp.responseApi.structure.list.message;
    }
    return [];
});

const fetchStructures = async () => {
    if (selectedStructureType.value === 'default_structures') {
        await withLoading(async () => {
            await storeStructure.getStructures();
        })
    }
    removeStructureSelectedClass()
};

const removeStructureSelectedClass = () => {
    const structureItems = document.querySelectorAll('.structure-item');
    structureItems.forEach(item => {
        item.classList.remove('selected');
    });
}

const selectStructure = (structureId) => {
    const selectedStructure = structuresList.value.find(structure => structure.id === structureId);
    storeApp.responseApi.structure.list.message = [selectedStructure];

    selectedStructureId.value = structureId;
    storeStructure.setStructureId(structureId);

    const selectedItem = document.getElementById(structureId);
    selectedItem.classList.add('selected');
};

const resetStructureListValues = () => {
    removeStructureSelectedClass();
    selectedStructureType.value = "";
    structuresList.value = [];
}

const handleWorkspaceChange = (workspaceId) => {
    storeWorkspace.setWorkspaceId(workspaceId)
    storeForm.validateWorkspace('editBoard');
}

const emitEvent = () => {
    emit('clearForm', resetStructureListValues);
}

const handleForm = async (e) => {
    const classList = e.target.classList;
    const formHandlers = {
        "form-update-board": {
            fields: ["name", "description", "workspace_id"],
            action: () => storeBoard.updateBoard(
                storeBoard.getBoardId,
                storeForm.fillFormData("editBoard")
            ),
            btnName: "btnEditBoard",
            keyForm: "editBoard",
            entity: "board.update",
            errorMessages: () => storeForm.errorValidations.editBoard.form.requiredFields,
            optionsRedirection: {
                routeName: "board-detail",
                delay: 1000,
                closeModal: true,
                action: "editBoard",
                workspaceId: storeWorkspace.getWorkspaceId,
                boardId: storeBoard.getBoardId
            },
            emitEvent: {
                nameEvent: "clearForm", data: resetStructureListValues
            },
            extraActions: [
                () => storeBoard.retrieveBoard(storeBoard.getBoardId),
                () => storeWorkspace.getWorkspaces()
            ]
        },
    };

    const matchingForm = Object.keys(formHandlers).find(cls => classList.contains(cls));
    if (matchingForm) {
        const formConfig = formHandlers[matchingForm];
        await handleFormSubmit(formConfig, emit);
    }
};

const handleKeyDown = (event) => {
    if (event?.key === 'Escape') {
        emit('clearForm', resetStructureListValues);
    }
};

watch(selectedStructureType, fetchStructures);

onMounted(async () => {
    await storeBoard.retrieveBoard(storeBoard.getBoardId)
    await storeWorkspace.getWorkspaces()
    window.addEventListener('keydown', handleKeyDown);
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
});

defineExpose({ resetStructureListValues }); 
</script>

<style scoped>
form.form-update-board {
    max-width: 600px;
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

div.structures-container {
    overflow-y: auto;
    max-height: 300px;
}

div.structure-item {
    width: 90px;
    height: 70px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border-radius: 10px;
}

div.structure-item.selected {
    width: 100%;
    height: 150px;
}

div.structure-item:hover {
    opacity: .8;
}
</style>