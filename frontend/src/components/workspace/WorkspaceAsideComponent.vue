<template>
    <div class="aside flex-shrink-0" id="aside">
        <div class="aside-header d-flex flex-row justify-content-between
            align-items-center" id="aside-header">
            <div class="aside-header-workspace d-flex flex-row justify-content-center 
                align-items-center gap-4" id="aside-header-workspace">
                <div class="aside-header-workspace-title text-center rounded-circle 
                    text-white border border-dark border-3 d-flex flex-column 
                    justify-content-center align-items-center p-2 ms-2 mt-2" id="aside-header-workspace-title"
                    :style="getStyles(workspace)">
                    <h4 class="d-block fw-bold mt-1 text-justify">
                        {{ getFirstLetter(workspace.name) }}
                    </h4>
                </div>
                <p class="d-block fw-bold m-auto text-justify">
                    {{ getTruncatedName(workspace.name) }}
                </p>
            </div>
            <v-icon :name="iconName" scale="2" fill="black" id="arrow" @click="reduceAside" />
        </div>
        <hr class="aside-hr" />
        <div class="aside-content d-flex flex-column justify-content-center align-items-start
            gap-2 mb-4" id="aside-content">
            <div class="w-100 d-flex flex-row justify-content-start align-items-center
                gap-2 ps-2" :class="{ active: activeButton === 'boards' }">
                <v-icon name="md-spacedashboard" scale="1" fill="black" />
                <button class="bg-white border-0 link-opacity-75-hover text-black 
                    text-decoration-none" @click="setActiveButton('boards')">
                    Boards
                </button>
            </div>
            <div class="w-100 d-flex flex-row justify-content-start align-items-center
                gap-2 ps-2" :class="{ active: activeButton === 'owner' }">
                <v-icon name="fa-users" scale="1" fill="black" />
                <button class="bg-white border-0 link-opacity-75-hover text-black 
                    text-decoration-none" @click="setActiveButton('owner')">
                    Owner
                </button>
            </div>
            <div class="w-100 d-flex flex-row justify-content-start align-items-center
                gap-2 ps-2" :class="{ active: activeButton === 'editWorkspace' }">
                <v-icon name="la-user-edit-solid" scale="1" fill="black" />
                <button class="bg-white border-0 link-opacity-75-hover text-black text-decoration-none"
                    @click="editWorkspace">
                    Edit workspace
                </button>
            </div>
            <div class="w-100 d-flex flex-row justify-content-start align-items-center
                gap-2 ps-2" :class="{ active: activeButton === 'deleteWorkspace' }">
                <v-icon name="ri-delete-bin-2-line" scale="1" fill="black" />
                <button class="bg-white border-0 link-opacity-75-hover text-black text-decoration-none"
                    @click="deleteWorkspace">
                    Delete workspace
                </button>
            </div>
        </div>
        <div v-if="workspace.boards.length > 0" class="aside-boards w-100" id="aside-boards-content">
            <p class="ps-2 fw-bold">Your boards</p>
            <div class="aside-boards-content w-100 p-2 mb-3 d-flex flex-row justify-content-start 
                align-items-center gap-2" v-for="(board, index) in workspace.boards" :key="index">
                <img :src="board.structure.path" :alt="board.id" class="aside-boards-content-img">
                <router-link :to="{ name: 'board-detail', params: { workspaceId: workspace.id, boardId: board.id } }"
                    class="link-opacity-75-hover text-black text-decoration-none">
                    {{ getTruncatedName(board.name) }}
                </router-link>
            </div>
        </div>
        <div v-else class="ps-1" id="aside-boards-create">
            <h5 class="ps-2 fw-bold mb-3">Your boards</h5>
            <p class="ps-2">You have no boards currently</p>
        </div>
    </div>
    <ModalComponent :showModal="storeApp.getModal" :action="storeApp.getActionModal" />
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import { useUtilsWorkspace } from '@/composables/useUtilsWorkspace';
import appStore from "@/stores/general/appStore";
import workspaceStore from "@/stores/workspace/workspaceStore";
import debounce from 'lodash.debounce';
import ModalComponent from '@/components/modals/ModalComponent.vue';

defineProps({
    workspace: {
        type: Object,
        required: true,
    },
});

const { getFirstLetter, getStyles, getTruncatedName } = useUtilsWorkspace();
const emit = defineEmits(['activateButtonAside']);
const storeApp = appStore()
const storeWorkspace = workspaceStore()
const iconName = ref("bi-arrow-left-short");
const isReduced = ref(false)

const activeButton = computed(() => storeWorkspace.getActiveComponent);

const setActiveButton = (button) => {
    storeWorkspace.setActiveComponent(button);
    emit('activateButtonAside', button);
};

const editWorkspace = () => {
    setActiveButton('editWorkspace')
    storeApp.setModal({ value: true, action: "editWorkspace" });
}

const deleteWorkspace = () => {
    setActiveButton("deleteWorkspace")
    storeApp.setModal({ value: true, action: "deleteWorkspace" });
}

const reduceAside = () => {
    const elements = {
        aside: document.querySelector("#aside"),
        asideHeaderWorkspace: document.querySelector("#aside-header-workspace"),
        arrow: document.querySelector("#arrow"),
        asideContent: document.querySelector("#aside-content"),
        asideBoardsContent: document.querySelector("#aside-boards-content"),
        asideBoardCreate: document.querySelector("#aside-boards-create"),
        hrs: document.querySelectorAll(".aside-hr"),
    };

    const isHidden = !isReduced.value;
    const width = isHidden ? "40px" : "290px";
    const visibility = isHidden ? "hidden" : "visible";
    const displayContent = isHidden ? "none" : "flex";
    const displayBoardsContent = isHidden ? "none" : "block";
    const displayBoardCreate = isHidden ? "none" : "block";
    const arrowOrder = isHidden ? "1" : "2";
    const icon = isHidden ? "bi-arrow-right-short" : "bi-arrow-left-short";
    const headerOrder = isHidden ? "2" : "1";
    const hrDisplay = isHidden ? "none" : "block";

    elements.aside.style.width = width;
    elements.asideHeaderWorkspace.style.visibility = visibility;
    elements.asideHeaderWorkspace.style.order = headerOrder;
    elements.arrow.style.order = arrowOrder;
    iconName.value = icon;
    elements.asideContent.style.display = displayContent;
    elements.asideContent.style.visibility = visibility;
    elements.hrs.forEach(hr => hr.style.display = hrDisplay);

    if (elements.asideBoardsContent) elements.asideBoardsContent.style.display = displayBoardsContent;
    if (elements.asideBoardCreate) elements.asideBoardCreate.style.display = displayBoardCreate;

    isReduced.value = !isReduced.value;
};

const handleResize = debounce(() => {
    const width = window.innerWidth;
    if (width <= 800) {
        isReduced.value = false;
        document.querySelector("#arrow").style.display = "none";
    } else {
        isReduced.value = true;
        document.querySelector("#arrow").style.display = "block";
    }
    reduceAside();
}, 300);

onMounted(() => {
    storeWorkspace.setActiveComponent("boards")
    window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
    storeWorkspace.setActiveComponent("boards")
    window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
div.aside {
    width: 290px;
}

div.aside-header-workspace-title {
    width: 70px;
    height: 70px;
}

div.aside-content div.active:hover,
div.aside-content div.active {
    background-color: rgb(145, 182, 235) !important;
    color: white !important;
}

div.aside-content div.active:hover button,
div.aside-content div.active button {
    background-color: rgb(145, 182, 235) !important;
    color: white !important;
}

div.aside-content div:hover {
    background-color: rgb(245, 242, 242) !important;
}

div.aside-content div:hover button {
    background-color: rgb(245, 242, 242) !important;
}

div.aside-boards {
    max-height: 50vh;
    overflow-y: auto;
}

div.aside-boards-content:hover {
    background-color: rgb(245, 242, 242);
}

img.aside-boards-content-img {
    width: 50px;
    height: 50px;
    object-fit: cover;
}
</style>
