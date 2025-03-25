<template>
    <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
        <template #response-api>
            <div v-if="structures && structures.length > 0" class="w-100 
                d-flex  flex-column flex-xl-row justify-content-center 
                justify-content-md-around align-items-center align-items-xl-start 
                gap-4 gap-xl-2 p-3 my-4">
                <div class="col-10 col-md-7 col-lg-5 col-xl-3 rounded border border-dark border-2">
                    <h4 class="bg-primary text-white text-center p-2 mb-0">Structures</h4>
                    <ul class="list-unstyled m-0 p-0">
                        <li v-for="(structure, index) in [{ category: { id: null, name: 'all' } }, ...uniqueStructures]"
                            :key="index" class="border border-1 border-dark">
                            <button type="button" :class="{ 'active': selectedCategory === structure.category.id }"
                                class="btn w-100 text-center p-3 text-center rounded-0 border-0"
                                @click="getStructureByCategory(structure.category.id)">
                                {{ structure.category.name.replace(/_/g, ' ') }}
                            </button>
                        </li>
                    </ul>
                </div>
                <div class="col-12 col-xl-9 rounded p-2 border border-dark border-2 p-3">
                    <h4 class="d-block text-center text-lg-start mb-4">Featured categories</h4>
                    <div class="category-container w-100 overflow-auto d-flex flex-row 
                        justify-content-between align-items-center gap-5 mt-5">
                        <div v-for="(category, index) in uniqueCategories" :key="index" class="category-container-card 
                            d-flex flex-column flex-shrink-0 justify-content-center align-items-center gap-3">
                            <img :src="category.path" :alt="category.name" @click="getStructureByCategory(category.id)"
                                class="object-fit-cover w-100" />
                            <p class="mb-1">{{ category.name.replace(/_/g, ' ') }}</p>
                        </div>
                    </div>
                    <hr class="border-3" />
                    <div v-if="!changeStructure" class="structure-container d-flex flex-column flex-lg-row flex-wrap
                        justify-content-evenly align-items-center gap-5 mt-4">
                        <StructureListComponent v-for="(structure, index) in filteredStructures" :key="index"
                            :structure="structure" @click="showStructureDetail(structure)" />
                    </div>
                    <div v-else class="w-100 d-flex flex-column justify-content-center 
                        align-items-center gap-1 bg-light">
                        <StructureDetailComponent :structure="selectedStructure" />
                    </div>
                </div>
                <div class="position-fixed bottom-0 start-0 p-3">
                    <v-icon class="iconArrow" name="bi-arrow-up-circle-fill" scale="3" @click="scrollToTop" />
                </div>
            </div>
            <div v-else class="mt-5 p-2 text-center">
                <h4>No structures available.</h4>
            </div>
        </template>
    </ResponseApiComponent>
</template>

<script setup>
import { watch, onMounted, computed, ref } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useScrollToTop } from '@/composables/useScrollToTop';
import appStore from "@/stores/general/appStore";
import structureStore from '@/stores/structure/structureStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';
import StructureListComponent from '@/components/structure/StructureListComponent.vue';
import StructureDetailComponent from '@/components/structure/StructureDetailComponent.vue';

const { loading, withLoading } = useLoading();
const { scrollToTop } = useScrollToTop();
const storeApp = appStore()
const storeStructure = structureStore()
const filteredStructures = ref([]);
const selectedCategory = ref(null);
const selectedStructure = ref(null);
const changeStructure = ref(false)
const entity = "structure.list"

const structures = computed(() => storeApp.responseApi.structure.list.message);
const uniqueStructures = computed(() => getUniqueStructures(structures.value));
const uniqueCategories = computed(() => getUniqueCategories(structures.value));

watch(structures, (newStructures) => {
    if (newStructures && newStructures.length > 0) {
        filteredStructures.value = newStructures;
    }
});

const getUniqueStructures = (structures) => {
    const seen = new Set();
    return structures.filter(({ category }) =>
        category?.name && !seen.has(category.name) && seen.add(category.name)
    );
};

const getUniqueCategories = (structures) => {
    const seen = new Set();
    return structures
        .map(({ category }) => category)
        .filter(category => category?.name && !seen.has(category.name) && seen.add(category.name));
};

const getStructureByCategory = (idCategory) => {
    selectedCategory.value = idCategory;
    if (idCategory) {
        filteredStructures.value = structures.value.filter(structure => structure.category.id === idCategory);
    } else {
        filteredStructures.value = structures.value;
    }
    changeStructure.value = false;
};

const showStructureDetail = (structure) => {
    selectedCategory.value = structure.category.id;
    selectedStructure.value = structure;
    changeStructure.value = true;
};

onMounted(async () => {
    await withLoading(async () => {
        await storeStructure.getStructures()
    });
})
</script>

<style scoped>
.last-no-border:last-child button {
    border-bottom: none;
}

ul li button.active {
    background-color: rgb(145, 182, 235);
    color: white;
    font-weight: bolder;
}

ul li button:hover {
    background-color: rgb(245, 242, 242);
}

ul li button.active:hover {
    background-color: rgb(145, 182, 235);
    color: white;
    font-weight: bold;
}

div.category-container {
    white-space: nowrap;
}

div.category-container div.category-container-card {
    width: 100px;
}

div.category-container div.category-container-card:hover {
    opacity: .9;
}

div.category-container-card img {
    height: 100px;
}

div.structure-container-card-detail-header div img {
    width: 75px;
    height: 75px;
}

.iconArrow {
    fill: #0d6efd;
}
</style>
