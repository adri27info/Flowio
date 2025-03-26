<template>
    <div v-if="card">
        <h5 class="text-center mt-2">Info about your card</h5>
        <hr class="mb-4" />
        <div class="container-retrieve-card-body d-flex flex-column justify-content-start
            align-items-center p-2 gap-4 text-center">
            <div>
                <h5>Title</h5>
                <p class="p-0 m-0 text-center">{{ getTruncatedName(card.title, 250) }}</p>
            </div>
            <hr class="w-100 p-0 m-0" />
            <div>
                <h5>Description</h5>
                <p class="p-0 m-0 text-center">
                    {{ cardDescription ? getTruncatedName(card.description, 250) : "No description available" }}
                </p>
            </div>
            <hr class="w-100 p-0 m-0" />
            <div>
                <h5 class="mb-3">Activity</h5>
                <template v-if="cardTraces">
                    <div v-for="(trace, index) in card.traces" :key="index" class="d-flex
                        flex-column justify-content-center align-items-center gap-3 w-100 mb-4">
                        <img class="m-0 p-0 h-auto object-fit-cover rounded-circle" :src="dataUser.attachment">
                        <div class="w-100">
                            <p class="m-0 mb-0 text-center">
                                {{ getTruncatedName(trace.description, 30) }} • {{ formatDate(trace.created_at) }}
                            </p>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <p class="m-0 mb-0 text-center">This card has no recent activity</p>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, onMounted, watch } from "vue"
import { useUtilsWorkspace } from '@/composables/useUtilsWorkspace';
import appStore from '@/stores/general/appStore';
import userStore from "@/stores/user/userStore";
import boardStore from "@/stores/board/boardStore";

const { getTruncatedName } = useUtilsWorkspace();
const storeApp = appStore()
const storeUser = userStore()
const storeBoard = boardStore()

const dataUser = computed(() => storeUser.getUser);
const card = computed(() => storeApp.responseApi.card.retrieve.message);
const cardDescription = computed(() => card.value && card.value.description.trim() !== "");
const cardTraces = computed(() => card.value && card.value.traces.length > 0);

watch(() => storeBoard.getCardId, async (newCardId) => {
    if (newCardId) {
        await storeBoard.retrieveCard(newCardId);
    }
});

const formatDate = (dateString) => {
    if (cardTraces.value) {
        const date = new Date(dateString);
        const options = {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
            hour12: true
        };

        return date.toLocaleString("en-US", options);
    }
};

onMounted(async () => {
    await storeBoard.retrieveCard(storeBoard.getCardId)
})
</script>

<style scoped>
div.container-retrieve-card-body img {
    width: 30px;
    height: 30px !important;
    padding: 2px;
}
</style>