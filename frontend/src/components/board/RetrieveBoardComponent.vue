<template>
    <div v-if="board">
        <h5 class="text-center mt-2">Info about your board</h5>
        <hr class="mb-4" />
        <div class="container-retrieve-board-header d-flex flex-column justify-content-end
            align-items-start text-white p-2 mb-3" :style="{ backgroundImage: 'url(' + board.structure.path + ')' }">
        </div>
        <div class="container-retrieve-board-body d-flex flex-column justify-content-start
            align-items-center p-2 gap-4 text-center">
            <div>
                <h5>Name</h5>
                <p class="p-0 m-0 text-center">{{ getTruncatedName(board.name, 250) }}</p>
            </div>
            <hr class="w-100 p-0 m-0" />
            <div>
                <h5>Description</h5>
                <p class="p-0 m-0 text-center">{{ getTruncatedName(board.description, 250) }}</p>
            </div>
            <hr class="w-100 p-0 m-0" />
            <div>
                <h5>Category</h5>
                <div class="d-flex flex-column justify-content-center align-items-center gap-1">
                    <img :src="board.structure.category.path" class="rounded-circle bg-white">
                    <p class="p-0 m-0">{{ board.structure.category.name.replace(/_/g, ' ') }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from "vue"
import { useUtilsWorkspace } from '@/composables/useUtilsWorkspace';
import appStore from '@/stores/general/appStore';

const storeApp = appStore()
const { getTruncatedName } = useUtilsWorkspace();

const board = computed(() => storeApp.responseApi.board.retrieve.message);
</script>

<style scoped>
div.container-retrieve-board-header {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    height: 250px;
    border-radius: 8px;
}

div.container-retrieve-board-body img {
    width: 30px;
    height: 30px;
    padding: 2px;
}
</style>