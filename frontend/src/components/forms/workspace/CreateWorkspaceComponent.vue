<template>
    <h5 class="text-center mt-2">Create new workspace</h5>
    <hr class="mb-4" />
    <div class="w-100 d-flex flex-column flex-lg-row justify-content-center 
        align-items-center gap-3">
        <form class="form-create-workspace bg-white p-3" @submit.prevent="handleForm" enctype="multipart/form-data">
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="name" class="form-label fw-bold text-center">Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="name"
                    placeholder="Enter the name" v-model="storeForm.formData.createWorkspace.name"
                    @input="storeForm.validateName('createWorkspace')">
                <p class="w-100 text-center text-danger mt-2 fw-bold">
                    {{ storeForm.formErrors.createWorkspace.name }}
                </p>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="description" class="form-label fw-bold text-center">
                    Description
                    <span class="text-danger">*</span>
                </label>
                <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="description"
                    placeholder="Enter the description" v-model="storeForm.formData.createWorkspace.description"
                    @input="storeForm.validateDescription('createWorkspace')">
                <p class="w-100 text-center text-danger mt-2 fw-bold">
                    {{ storeForm.formErrors.createWorkspace.description }}
                </p>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="background-workspace" class="form-label fw-bold text-center">
                    Background workspace <span class="text-danger">*</span>
                </label>
                <div class="container-colors d-flex flex-wrap justify-content-center gap-2 w-100">
                    <label v-for="bg in backgroundWorkspaces" :key="bg.id"
                        class="d-flex flex-column justify-content-center align-items-center label-colors gap-2">
                        <input type="radio" v-model="storeForm.formData.createWorkspace.background_workspace_id"
                            :value="bg.id" @change="storeForm.validateBackgroundWorkspace('createWorkspace')" />
                        <div class="w-100 text-center text-white label-color rounded-circle"
                            :style="{ background: bg.gradient_theme }">
                            &nbsp;
                        </div>
                    </label>
                </div>
                <p class="w-100 text-center text-danger mt-2 fw-bold">
                    {{ storeForm.formErrors.createWorkspace.background_workspace_id }}
                </p>
            </div>
            <p class="w-100 text-center showErrorForm fw-bold mb-5 text-danger">
                {{ storeForm.formErrors.createWorkspace.form }}
            </p>
            <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
                <template #response-api>
                    <p :class="storeApp.getResponseApi('workspace.create').class" class="w-100 text-center fw-bold">
                        {{ storeApp.getResponseApi('workspace.create').message }}
                    </p>
                </template>
            </ResponseApiComponent>
            <div class="modal-container-buttons d-flex flex-row justify-content-center
                align-items-center gap-2 mt-5">
                <button type="button" class="btn btn-secondary w-75 d-block m-auto" data-bs-dismiss="modal">
                    Close
                </button>
                <button type="submit" class="btn btn-primary w-75 d-block m-auto btnCreateWorkspace">
                    Create
                </button>
            </div>
        </form>
        <div class="images-workspace position-relative d-flex justify-content-center
            align-items-center">
            <img class="bgImageWorkspace" :src="storeApp.getDefaultWorkspaceBGModal" id="bg-workspace" />
            <img class="defaultImageWorkspace" :src="storeApp.getDefaultWorkspaceLogoModal" id="default-workspace" />
        </div>
    </div>
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
const entity = "workspace.create"

const backgroundWorkspaces = computed(() => storeApp.responseApi.bgWorkspace.list.message);

const handleForm = async (e) => {
    const classList = e.target.classList;
    const formHandlers = {
        "form-create-workspace": {
            fields: ["name", "description", "background_workspace_id"],
            action: () => storeWorkspace.createWorkspace(storeForm.fillFormData("createWorkspace")),
            btnName: "btnCreateWorkspace",
            keyForm: "createWorkspace",
            entity: "workspace.create",
            errorMessages: () => storeForm.errorValidations.createWorkspace.form.requiredFields,
            optionsRedirection: {
                routeName: "workspaces",
                delay: 1000,
                closeModal: true,
                action: "createWorkspace"
            },
            emitEvent: { nameEvent: "clearForm" },
            extraActions: () => storeWorkspace.getWorkspaces(),
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
form.form-create-workspace {
    width: 600px;
}

label.label-colors {
    width: 50px;
}

div.label-color {
    height: 45px;
}

div.images-workspace {
    width: 500px;
}

div.images-workspace img.bgImageWorkspace {
    width: 100%;
    display: block;
    z-index: 1;
}

div.images-workspace img.defaultImageWorkspace {
    position: absolute;
    width: 80%;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
}

@media (max-width: 991px) {
    div.images-workspace {
        order: -1;
        width: 70%;
    }

    div.images-workspace img.bgImageWorkspace {
        width: 65%;
        visibility: hidden;
    }

    div.images-workspace img.defaultImageWorkspace {
        width: 80%;
    }

    form.form-create-workspace {
        width: 100%;
    }
}

@media (max-width: 600px) {
    div.images-workspace {
        width: 90%;
    }

    div.images-workspace img.bgImageWorkspace {
        width: 75%;
    }

    div.images-workspace img.defaultImageWorkspace {
        width: 90%;
    }
}
</style>