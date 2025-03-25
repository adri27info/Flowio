<template>
    <h5 class="text-center mt-2">Edit your workspace</h5>
    <hr class="mb-4" />
    <form class="form-update-workspace w-100 bg-white p-2" @submit.prevent="handleForm" enctype="multipart/form-data">
        <div class="d-flex flex-column justify-content-center align-items-center mb-4">
            <label for="name" class="form-label fw-bold">Name <span class="text-danger">*</span></label>
            <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="name"
                placeholder="Enter the name" v-model="storeForm.formData.editWorkspace.name"
                @input="storeForm.validateName('editWorkspace')">
            <p class="w-100 text-center text-danger mt-2 fw-bold">
                {{ storeForm.formErrors.editWorkspace.name }}
            </p>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center mb-4">
            <label for="description" class="form-label fw-bold">Description <span class="text-danger">*</span></label>
            <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="description"
                placeholder="Enter the description" v-model="storeForm.formData.editWorkspace.description"
                @input="storeForm.validateDescription('editWorkspace')">
            <p class="w-100 text-center text-danger mt-2 fw-bold">
                {{ storeForm.formErrors.editWorkspace.description }}
            </p>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center mb-4">
            <label for="background-workspace" class="form-label fw-bold text-center">
                Background workspace
            </label>
            <div class="container-colors d-flex flex-wrap justify-content-center gap-2 w-100">
                <label v-for="bg in backgroundWorkspaces" :key="bg.id"
                    class="d-flex flex-column justify-content-center align-items-center label-colors gap-2">
                    <input type="radio" v-model="storeForm.formData.editWorkspace.background_workspace_id"
                        :value="bg.id" />
                    <div class="w-100 text-center text-white label-color rounded-circle"
                        :style="{ background: bg.gradient_theme }">
                        &nbsp;
                    </div>
                </label>
            </div>
        </div>
        <p class="w-100 text-center showErrorForm fw-bold mb-5 text-danger">
            {{ storeForm.formErrors.editWorkspace.form }}
        </p>
        <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
            <template #response-api>
                <p :class="storeApp.getResponseApi('workspace.update').class"
                    class="w-100 text-center fw-bold mt-3 mb-3">
                    {{ storeApp.getResponseApi('workspace.update').message }}
                </p>
            </template>
        </ResponseApiComponent>
        <div class="modal-container-buttons d-flex flex-row justify-content-center
            align-items-center gap-2 mt-5">
            <button type="button" class="btn btn-secondary w-75 d-block m-auto" data-bs-dismiss="modal">
                Close
            </button>
            <button type="submit" class="btn btn-warning w-75 d-block m-auto btnEditWorkspace">Edit</button>
        </div>
    </form>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useFormHandler } from "@/composables/useFormHandler";
import appStore from '@/stores/general/appStore';
import formStore from '@/stores/general/formStore';
import workspaceStore from '@/stores/workspace/workspaceStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading, withLoading } = useLoading();
const { handleFormSubmit } = useFormHandler(withLoading);
const emit = defineEmits(['clearForm']);
const storeApp = appStore()
const storeForm = formStore()
const storeWorkspace = workspaceStore()
const entity = "workspace.update"

const backgroundWorkspaces = computed(() => storeApp.responseApi.bgWorkspace.list.message);

const handleForm = async (e) => {
    const classList = e.target.classList;
    const formHandlers = {
        "form-update-workspace": {
            fields: ["name", "description"],
            action: () => storeWorkspace.updateWorkspace(
                storeWorkspace.getWorkspaceId,
                storeForm.fillFormData("editWorkspace")
            ),
            btnName: "btnEditWorkspace",
            keyForm: "editWorkspace",
            entity: "workspace.update",
            errorMessages: () => storeForm.errorValidations.editWorkspace.form.requiredFields,
            optionsRedirection: {
                routeName: "workspace-detail",
                delay: 1000,
                closeModal: true,
                action: "editWorkspace",
                workspaceId: storeWorkspace.getWorkspaceId,
            },
            emitEvent: { nameEvent: "clearForm" },
            extraActions: [
                () => storeWorkspace.retrieveWorkspace(storeWorkspace.getWorkspaceId),
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

onMounted(async () => {
    await storeWorkspace.getBackgroundWorkspaces()
})
</script>

<style scoped>
form.form-update-workspace {
    max-width: 600px;
}

label.label-colors {
    width: 50px;
}

div.label-color {
    height: 45px;
}
</style>