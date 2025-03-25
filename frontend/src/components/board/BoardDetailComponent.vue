<template>
    <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
        <template #response-api>
            <div v-if="board" class="container-board min-vh-100 position-relative"
                :style="{ backgroundImage: 'url(' + board.structure.path + ')' }">
                <div class="overlay position-absolute top-0 left-0 w-100 h-100 z-1"></div>
                <div class="container-board__header w-100 bg-light bg-opacity-50 p-2
                    d-flex flex-row justify-content-between align-items-center
                    position-relative z-2">
                    <p class="m-0 col-6 text-white">{{ getTruncatedName(board.name, 50) }}</p>
                    <v-icon name="la-ellipsis-h-solid" scale="1.3" fill="white" @click.stop="toggleMenu" />
                </div>
                <ListComponent :menuOpen="menuOpen" />
            </div>
            <div v-else class="mt-5 p-2 text-center">
                <h4>The board does not exist</h4>
            </div>
        </template>
    </ResponseApiComponent>
</template>

<script setup>
import { onMounted, computed, watch, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useLoading } from '@/composables/useLoading';
import { useUtilsWorkspace } from '@/composables/useUtilsWorkspace';
import appStore from "@/stores/general/appStore";
import userStore from '@/stores/user/userStore';
import boardStore from '@/stores/board/boardStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';
import ListComponent from '@/components/board/list/ListComponent.vue';

const { loading, withLoading } = useLoading();
const { getTruncatedName } = useUtilsWorkspace();
const storeApp = appStore();
const storeUser = userStore()
const storeBoard = boardStore();
const route = useRoute();
const entity = "board.retrieve";
const menuOpen = ref(false);

const board = computed(() => storeApp.responseApi.board.retrieve.message);
const cardCreated = computed(() => storeApp.responseApi.card.create.message);
const boardId = computed(() => route.params.boardId);
const workspaceId = computed(() => route.params.workspaceId);

watch([boardId, workspaceId], async ([newBoardId, newWorkspaceId], [oldBoardId, oldWorkspaceId]) => {
    if ((newBoardId !== oldBoardId) || (oldWorkspaceId && newWorkspaceId !== oldWorkspaceId)) {
        await withLoading(async () => {
            await storeBoard.retrieveBoard(route.params.boardId);
        });
    }
}, { immediate: true });

watch(cardCreated, async () => {
    if (cardCreated.value) {
        const formData = new FormData();
        formData.append("user_id", storeUser.getIdUser);
        formData.append("card_id", storeBoard.getCardId);
        formData.append("description", "Created this card");
        await storeBoard.createTrace(formData)
    }
});

const toggleMenu = () => {
    menuOpen.value = !menuOpen.value;
};

document.addEventListener("click", (event) => {
    if (!event.target.closest(".dropdown-menu") && !event.target.closest(".la-ellipsis-h-solid")) {
        menuOpen.value = false;
    }
});

onMounted(async () => {
    const boardId = route.params.boardId;
    await withLoading(async () => {
        await storeBoard.retrieveBoard(boardId);
    });
});
</script>

<style scoped>
div.container-board {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

div.container-board__header p {
    padding-left: 14px;
}

div.overlay {
    background-color: rgba(0, 0, 0, 0.6);
}
</style>
