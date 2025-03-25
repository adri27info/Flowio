<template>
    <div class="container-search pt-1 w-100 position-relative" @mouseleave="onMouseLeaveDropdown">
        <div class="w-100 input-group">
            <span class="input-group-text bg-primary text-white">
                <v-icon name="hi-search" scale="1" fill="white" />
            </span>
            <input type="text" class="form-control" placeholder="Search workspaces and boards" v-model="searchQuery"
                @focus="setOpenDropDown(true)" id="searchInput" />
        </div>
        <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)" :spinnerWrapper="true">
            <template #response-api>
                <div v-if="workspaces && workspaces.length > 0">
                    <div v-if="openDropdown" class="dropdown-content position-absolute w-100 bg-white">
                        <div v-for="workspace in filteredWorkspaces" :key="workspace.id" class="dropdown-item 
                            mb-2 bg-white mb-3" @click="setOpenDropDown(false)">
                            <router-link :to="{ name: 'workspace-detail', params: { workspaceId: workspace.id } }"
                                class="text-black text-decoration-none workspace_header d-flex flex-column 
                                flex-md-row justify-content-center justify-content-sm-start align-items-center 
                                gap-3 mb-4">
                                <div class="workspace-icon text-center rounded-circle text-white d-flex 
                                    flex-column justify-content-center align-items-center border 
                                    border-dark border-2 mt-1 object-fit-cover rounded" :style="getStyles(workspace)">
                                    <h4 class="d-block fw-bold m-auto">
                                        {{ getFirstLetter(workspace.name) }}
                                    </h4>
                                </div>
                                <div class="workspace-icon-body m-auto w-100">
                                    <h5 class="mt-1 mb-1 p-0 text-center text-md-start">
                                        {{ getTruncatedName(workspace.name) }}
                                    </h5>
                                    <p class="p-0 m-0 small text-center text-md-start">
                                        {{ getTruncatedName(workspace.description, 30) }}
                                    </p>
                                </div>
                            </router-link>
                            <div class="boards-list ms-0 ms-md-3 ps-0 ps-md-3">
                                <h5 class="small text-muted text-center text-md-start mb-4">Boards</h5>
                                <div v-if="filteredBoardsInWorkspace(workspace).length > 0">
                                    <div v-for="board in filteredBoardsInWorkspace(workspace)" :key="board.id"
                                        class="board-item m-0">
                                        <router-link :to="{
                                            name: 'board-detail', params: {
                                                workspaceId: workspace.id,
                                                boardId: board.id
                                            }
                                        }" class="link-opacity-75-hover text-black text-decoration-none">
                                            <div class="d-flex flex-column flex-md-row justify-content-center 
                                                align-items-center gap-3 mb-3">
                                                <div class="board-image me-2"
                                                    :style="{ backgroundImage: `url(${board.structure.path})` }">
                                                </div>
                                                <div class="d-flex flex-column justify-content-center 
                                                    align-items-center align-items-md-start w-100">
                                                    <h6 class="mb-1">
                                                        {{ getTruncatedName(board.name, 25) }}
                                                    </h6>
                                                    <p class="text-muted small mb-1 text-center">
                                                        {{ getTruncatedName(board.description, 30) }}
                                                    </p>
                                                    <div class="board-category d-flex align-items-center">
                                                        <img :src="board.structure.category.path"
                                                            :alt="board.structure.category.name" class="me-1" width="16"
                                                            height="16">
                                                        <span class="small text-muted">
                                                            {{ board.structure.category.name.replace(/_/g, ' ') }}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="custom-divider w-100 my-4"></div>
                                        </router-link>
                                    </div>
                                </div>
                                <div v-else class="mb-3">
                                    <p class="small p-0 m-0 small text-center text-md-start">
                                        This workspace currently has no boards
                                    </p>
                                    <div class="custom-divider w-100 my-4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>
        </ResponseApiComponent>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useUtilsWorkspace } from '@/composables/useUtilsWorkspace';
import { useRoute } from 'vue-router';
import debounce from 'lodash.debounce';
import appStore from "@/stores/general/appStore";
import workspaceStore from '@/stores/workspace/workspaceStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading, withLoading } = useLoading();
const { getFirstLetter, getStyles, getTruncatedName } = useUtilsWorkspace();
const storeApp = appStore();
const storeWorkspace = workspaceStore();
const route = useRoute();
const entity = "workspace.list";
const searchQuery = ref('');
const openDropdown = ref(false);
const workspaces = ref([]);

const workspacesMessage = computed(() => storeApp.responseApi.workspace.list.message);

const filteredWorkspaces = computed(() => {
    if (!workspaces.value || workspaces.value.length === 0) return [];
    let filtered = workspaces.value;

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        filtered = filtered.filter(workspace =>
            workspace.name.toLowerCase().includes(query) ||
            workspace.description.toLowerCase().includes(query) ||
            workspace.boards.some(board =>
                board.name.toLowerCase().includes(query) ||
                board.description.toLowerCase().includes(query)
            )
        );
    }

    return filtered.sort((a, b) => b.boards.length - a.boards.length);
});

watch(searchQuery, () => {
    fetchWorkspaces();
});

watch(() => route.fullPath, () => {
    searchQuery.value = '';
});

watch(workspacesMessage, (newWorkspaces, oldWorkspaces) => {
    if (newWorkspaces !== oldWorkspaces) {
        workspaces.value = newWorkspaces
    }
});

const fetchWorkspaces = debounce(async () => {
    await withLoading(async () => {
        await storeWorkspace.getWorkspaces();
        workspaces.value = storeApp.responseApi.workspace.list.message;
    });
}, 500);


const filteredBoardsInWorkspace = (workspace) => {
    if (!searchQuery.value.trim()) return workspace.boards;

    const query = searchQuery.value.toLowerCase();

    if (workspace.name.toLowerCase().includes(query) || workspace.description.toLowerCase().includes(query)) {
        return workspace.boards;
    }

    return workspace.boards.filter(board =>
        board.name.toLowerCase().includes(query) ||
        board.description.toLowerCase().includes(query)
    );
};

const onMouseLeaveDropdown = () => {
    const searchInput = document.querySelector("#searchInput");
    if (searchInput) {
        if (searchInput.value === "") {
            closeDropdown();
        }
        searchInput.blur();
    }
};

const setOpenDropDown = (value) => {
    openDropdown.value = value;
};

const closeDropdown = () => {
    openDropdown.value = false;
};

onMounted(async () => {
    await storeWorkspace.getWorkspaces();
    workspaces.value = storeApp.responseApi.workspace.list.message;
});
</script>

<style scoped>
.search-results {
    max-height: 0px;
    overflow-y: auto;
}

.workspace_header:hover {
    background-color: rgb(245, 242, 242) !important;
}

.workspace-icon {
    width: 50px;
    height: 45px;
}

.board-image {
    width: 55px;
    height: 45px;
    border-radius: 8px;
    background-size: cover;
    background-position: center;
}

.board-category img {
    width: 16px;
    height: 16px;
}

.boards-list {
    border-left: 2px solid black;
}

.board-item:hover {
    background-color: rgb(245, 242, 242) !important;
}

.custom-divider {
    border-top: 2px solid black;
}

.dropdown-content {
    top: 100%;
    left: 0;
    max-height: 320px;
    overflow-y: auto;
    border: 1px solid #ddd;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10;
    padding: 10px 0;
}

.dropdown-item {
    padding: 10px;
    cursor: pointer;
}

@media (max-width: 768px) {
    .boards-list {
        border-left: none;
    }
}
</style>
