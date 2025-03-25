<template>
    <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
        <template #response-api>
            <div v-if="workspace" class="d-flex flex-row flex-nowrap justify-content-between
                align-items-start w-100">
                <WorkspaceAsideComponent :workspace="workspace" @activateButtonAside="showComponentActivated" />
                <div class="container-workspace-detail-body overflow-auto w-100
                    min-vh-100 p-2">
                    <div class="container-workspace-detail-body-header d-flex flex-column
                        justify-content-center align-items-center gap-2">
                        <div class="container-workspace-detail-body-header-title text-white 
                            text-center rounded-circle d-flex flex-column justify-content-center
                            align-items-center p-2 ms-2 mt-2" id="aside-header-workspace-title"
                            :style="getStyles(workspace)">
                            <h4 class="d-block fw-bold mt-1 text-justify">
                                {{ getFirstLetter(workspace.name) }}
                            </h4>
                        </div>
                        <h2 class="mt-3 text-center">{{ getTruncatedName(workspace.name, 50) }}</h2>
                        <p class="mt-1 text-center">{{ getTruncatedName(workspace.description, 50) }}</p>
                    </div>
                    <hr />
                    <WorkspaceBoardDetailComponent v-if="activeComponent === 'boards'" :boards="workspace.boards" />
                    <WorkspaceOwnerComponent v-else-if="activeComponent === 'owner'" />
                </div>
            </div>
            <div v-else class="mt-5 p-2 text-center">
                <h4 class="mb-4">The workspace does not exist.</h4>
            </div>
        </template>
    </ResponseApiComponent>
</template>

<script setup>
import { onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useLoading } from '@/composables/useLoading';
import { useUtilsWorkspace } from '@/composables/useUtilsWorkspace';
import appStore from "@/stores/general/appStore";
import workspaceStore from '@/stores/workspace/workspaceStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';
import WorkspaceAsideComponent from '@/components/workspace/WorkspaceAsideComponent.vue';
import WorkspaceBoardDetailComponent from '@/components/workspace/WorkspaceBoardDetailComponent.vue';
import WorkspaceOwnerComponent from '@/components/workspace/WorkspaceOwnerComponent.vue';

const { loading, withLoading } = useLoading();
const { getFirstLetter, getStyles, getTruncatedName } = useUtilsWorkspace();
const route = useRoute();
const storeApp = appStore()
const storeWorkspace = workspaceStore()
const entity = "workspace.retrieve"

const activeComponent = computed(() => storeWorkspace.getActiveComponent);
const workspace = computed(() => storeApp.responseApi.workspace.retrieve.message);
const workspaceId = computed(() => route.params.workspaceId);

watch(workspaceId, async (newId, oldId) => {
    if (newId !== oldId) {
        await withLoading(async () => {
            await storeWorkspace.retrieveWorkspace(newId);
        });
    }
}, { immediate: true });

const showComponentActivated = (component) => {
    storeWorkspace.setActiveComponent(component);
}

onMounted(async () => {
    const workspaceId = route.params.workspaceId;
    await withLoading(async () => {
        await storeWorkspace.retrieveWorkspace(workspaceId)
    });
});
</script>

<style scoped>
div.container-workspace-detail-body {
    border-left: 2px solid black;
}

div.container-workspace-detail-body-header-title {
    width: 70px;
    height: 70px;
    border: 2px solid black;
}

div.container-workspace-detail-body-board-header a {
    width: 250px;
}

div.container-workspace-detail-body-board {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 350px;
    height: 250px;
    border-radius: 10px;
}

div.overlay {
    background-color: rgba(0, 0, 0, 0.3);
}

div.overlay:hover {
    background-color: rgba(0, 0, 0, 0.2);
}

@media (max-width: 992px) {
    div.container-workspace-detail-body-board {
        width: 100%;
        height: 300px;
        margin: auto;
    }
}

@media (max-width: 450px) {
    div.container-workspace-detail-body-board {
        height: 250px;
    }
}

@media (max-width: 400px) {
    div.container-workspace-detail-body-board {
        height: 200px;
    }
}
</style>
