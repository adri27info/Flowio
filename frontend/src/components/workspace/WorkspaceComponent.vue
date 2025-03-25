<template>
    <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
        <template #response-api>
            <div v-if="workspaces && workspaces.length > 0" class="d-flex flex-row
                flex-wrap justify-content-center align-items-center my-4 gap-3">
                <div class="w-100 d-flex flex-column justify-content-center
                    align-items-center mb-5">
                    <h2 class="text-black text-center p-3">Your workspaces</h2>
                    <button class="btnCreate btn btn-primary p-2" @click="createWorkspace">
                        Create a workspace
                    </button>
                </div>
                <div v-for="(workspace, index) in workspaces" :key="index" class="container-workspace 
                    d-flex flex-column justify-content-center align-items-start p-4 mb-5 
                    rounded text-white bg-white border border-4 border-dark">
                    <div class="container-workspace-header w-100 d-flex flex-column
                        justify-content-center align-items-center gap-3 ">
                        <div class="container-workspace-header-letter text-center 
                            rounded-circle text-white d-flex flex-column 
                            justify-content-center align-items-center
                            border border-dark border-3" :style="getStyles(workspace)">
                            <h4 class="d-block fw-bold mt-1 text-justify">
                                {{ getFirstLetter(workspace.name) }}
                            </h4>
                        </div>
                        <p class="text-black text-center fw-bold fs-5"> {{ getTruncatedName(workspace.name, 50) }}</p>
                        <div class="container-workspace-header-content-right p-4 w-100 d-flex 
                            flex-column flex-sm-row justify-content-center 
                            align-items-center gap-4 text-center">
                            <router-link :to="{ name: 'workspace-detail', params: { workspaceId: workspace.id } }"
                                class="btn btn-dark col-12 col-sm-6 p-2 fs-5">
                                Information
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="mt-5 p-2 text-center">
                <h4 class="mb-4">Your workspaces.</h4>
                <p>You are not yet a member of any workspace.</p>
                <button class="btn btn-primary btnCreateWorkspace" @click="createWorkspace">
                    Create a workspace
                </button>
            </div>
            <ModalComponent :showModal="storeApp.getModal" :action="storeApp.getActionModal" />
        </template>
    </ResponseApiComponent>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useUtilsWorkspace } from '@/composables/useUtilsWorkspace';
import appStore from "@/stores/general/appStore";
import workspaceStore from '@/stores/workspace/workspaceStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';
import ModalComponent from '@/components/modals/ModalComponent.vue';

const { loading, withLoading } = useLoading();
const { getFirstLetter, getStyles, getTruncatedName } = useUtilsWorkspace()
const storeApp = appStore()
const storeWorkspace = workspaceStore()
const entity = "workspace.list"

const workspaces = computed(() => storeApp.responseApi.workspace.list.message);

const createWorkspace = () => {
    storeApp.setModal({ value: true, action: "createWorkspace" });
}

onMounted(async () => {
    await withLoading(async () => {
        await storeWorkspace.getWorkspaces()
    });
})
</script>

<style scoped>
:global(.container-response-api) {
    margin-bottom: 0 !important;
}

button.btnCreateWorkspace,
button.btnCreate {
    width: 250px;
}

div.container-workspace {
    width: 700px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2), 0 5px 15px rgba(0, 0, 0, 0.1);
}

div.container-workspace-header-letter {
    width: 70px;
    height: 70px;
}

div.container-workspace-header-content-right {
    background-color: rgb(238, 235, 235);
}

@media (max-width: 576px) {
    div.container-workspace-header button {
        width: 100%;
    }
}

@media (max-width: 772px) {
    div.container-workspace-header-content-right {
        width: 100%;
    }
}

@media (max-width: 1400px) {
    div.container-workspace {
        width: 90%;
    }
}
</style>
