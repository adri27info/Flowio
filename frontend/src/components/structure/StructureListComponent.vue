<template>
    <div class="structure-container-card d-flex flex-column justify-content-center
        align-items-center gap-3">
        <img :src="structure.path" />
        <h5 class="text-center">{{ structure.title }}</h5>
    </div>
</template>

<script setup>
defineProps({
    structure: {
        type: Object,
        required: true
    },
});
</script>

<style scoped>
div.structure-container-card {
    border-radius: 10px;
    width: 400px;
}

div.structure-container-card img {
    width: 100%;
    height: 250px;
    object-fit: cover;
    border-radius: 10px;
    border: 2px solid black;
}

div.structure-container-card img:hover {
    opacity: .9;
}

@media (max-width: 1210px) {
    div.structure-container-card {
        width: 500px;
        margin: auto;
    }

    div.structure-container-card img {
        width: 100%;
        height: 500px;
    }
}

@media (max-width: 768px) {
    div.structure-container-card {
        width: 100%;
    }
}

@media (max-width: 576px) {
    div.structure-container-card img {
        height: 350px;
    }
}

@media (max-width: 400px) {
    div.structure-container-card img {
        height: 200px;
    }
}
</style>