<template>
    <div v-if="boards.length > 0" class="d-flex flex-wrap flex-row justify-content-evenly 
        align-items-center gap-4">
        <div class="container-workspace-detail-body-board-header w-100 d-flex 
            flex-column justify-content-center align-items-center mb-4">
            <h4 class="d-blocktext-center mt-3">Boards</h4>
            <router-link :to="{ name: 'structures' }" class="btn btn-primary btnCreate p-2 mt-3">
                Create new board
            </router-link>
        </div>
        <div class="container-workspace-detail-body d-flex flex-row flex-wrap justify-content-evenly
            align-items-center gap-5 p-2 w-100 h-100">
            <div class="container-workspace-detail-body-board position-relative overflow-hidden"
                v-for="(board, index) in boards" :key="index">
                <router-link :to="{
                    name: 'board-detail', params: {
                        workspaceId: board.workspace_id, boardId: board.id
                    }
                }" class="text-black text-decoration-none">
                    <div class="board-image w-100 h-100"
                        :style="{ backgroundImage: 'url(' + board.structure.path + ')' }">
                    </div>
                    <div class="overlay position-absolute top-0 start-0 w-100 h-100 z-1"></div>
                    <div class="body-board-content text-white position-absolute bottom-0 w-100 p-2 z-2">
                        <p class="p-0 mt-2 ms-4 text-white fw-bold">{{ getTruncatedName(board.name) }}</p>
                        <p class="p-0 mt-2 ms-4 text-white">{{ getTruncatedName(board.description, 30) }}</p>
                        <div class="body-board-content__structure d-flex flex-row justify-content-start
                            align-items-center gap-3 ps-3">
                            <img :src="board.structure.category.path" class="ms-2 rounded-circle bg-white">
                            <p class="p-0 m-0 text-white">{{ board.structure.category.name.replace(/_/g, ' ') }}</p>
                        </div>
                    </div>
                </router-link>
            </div>
        </div>
    </div>
    <div v-else class="container-workspace-detail-body-board-header w-100 d-flex 
        flex-column justify-content-center align-items-center mb-5">
        <h4 class="d-blocktext-center mt-3">Boards</h4>
        <router-link :to="{ name: 'structures' }" class="btn btn-primary btnCreate p-2 mt-3">
            Create your first board
        </router-link>
    </div>
</template>

<script setup>
import { useUtilsWorkspace } from '@/composables/useUtilsWorkspace';

defineProps({
    boards: {
        type: Object,
        required: true,
    },
});

const { getTruncatedName } = useUtilsWorkspace();
</script>

<style scoped>
div.container-workspace-detail-body {
    overflow-y: auto;
}

div.container-workspace-detail-body-board {
    width: 350px;
    height: 350px;
    border-radius: 10px;
    border: 2px solid black;
}

div.board-image {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    transition: transform 0.3s ease;
}

div.container-workspace-detail-body-board:hover div.board-image {
    transform: scale(1.1);
}

div.overlay {
    background-color: rgba(0, 0, 0, 0.3);
    transition: background-color 0.3s ease;
}

div.container-workspace-detail-body-board:hover .overlay {
    background-color: rgba(0, 0, 0, 0.5);
}

div.body-board-content {
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, rgba(0, 0, 0, 0) 100%);
}

div.body-board-content__structure img {
    width: 30px;
    height: 30px;
    padding: 2px;
}

.btnCreate {
    width: 250px;
}

@media (max-width: 768px) {
    div.container-workspace-detail-body {
        justify-content: center;
    }

    div.container-workspace-detail-body-board {
        width: 100%;
    }
}

@media (max-width: 450px) {
    div.container-workspace-detail-body-board {
        width: 100%;
        height: 300px;
    }
}
</style>
