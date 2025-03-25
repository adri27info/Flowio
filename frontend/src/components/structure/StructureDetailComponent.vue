<template>
    <div class="structure-container-card-detail-header w-100 d-flex flex-column flex-sm-row
        justify-content-center align-items-center gap-4 p-3">
        <div>
            <router-link :to="{ name: 'login' }" class="mb-3">
                <img :src="storeApp.getDefaultLogoImageUrl" id="flowio" alt="Flowio Logo" class="w-100" />
            </router-link>
        </div>
        <div>
            <p class="p-0 m-0 fw-bold text-center">Created by Flowio</p>
            <p class="p-0 m-0 text-center">Category: {{ structure.category.name.replace(/_/g, ' ') }}</p>
            <button v-if="workspaces && workspaces.length > 0" class="btn btn-primary mt-1 btnCreate"
                @click="createBoard">
                Create new board
            </button>
        </div>
    </div>
    <hr class="border border-2 w-100 border-dark mb-5">
    <div class="w-100 d-flex flex-xl-column flex-wrap 
        justify-content-center align-items-center gap-3">
        <h3 class="fw-bold text-center mb-4 w-100">{{ structure.title }}</h3>
        <h5 class="text-center w-100">About this structure: </h5>
        <p class="text-center w-100"> {{ structure.description }}</p>
        <div class="structure-container-card-detail-body-container-img position-relative m-auto"
            :style="{ backgroundImage: 'url(' + structure.path + ')' }">
            <BoardPreviewComponent />
        </div>
    </div>
    <ModalComponent :showModal="storeApp.getModal" :action="storeApp.getActionModal" />
</template>

<script setup>
import { onMounted, computed } from "vue";
import appStore from "@/stores/general/appStore";
import workspaceStore from "@/stores/workspace/workspaceStore";
import structureStore from "@/stores/structure/structureStore";
import BoardPreviewComponent from '@/components/board/BoardPreviewComponent.vue';
import ModalComponent from '@/components/modals/ModalComponent.vue';

const props = defineProps({
    structure: {
        type: Object,
        required: true
    },
});

const storeApp = appStore()
const storeWorkspace = workspaceStore()
const storeStructure = structureStore()
const workspaces = computed(() => storeApp.responseApi.workspace.list.message)

const createBoard = () => {
    storeStructure.setStructureId(props.structure.id)
    storeApp.setModal({ value: true, action: "createBoard" });
}

onMounted(async () => {
    await storeWorkspace.getWorkspaces()
})
</script>

<style scoped>
div.structure-container-card-detail-header div img {
    width: 75px;
    height: 75px;
}

div.structure-container-card-detail-body-container-img {
    width: 800px;
    height: 600px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

button.btnCreate {
    width: 200px;
}

@media (max-width: 992px) {
    div.structure-container-card-detail-body-container-img {
        width: 100%;
        height: 400px;
    }
}

@media (max-width: 576px) {
    div.structure-container-card-detail-body-container-img {
        height: 300px;
    }
}

@media (max-width: 400px) {
    div.structure-container-card-detail-body-container-img {
        height: 200px;
    }
}
</style>