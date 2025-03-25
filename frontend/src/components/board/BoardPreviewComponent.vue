<template>
    <div class="overlay position-absolute top-0 start-0 w-100 h-100 z-1"></div>
    <div class="content position-relative z-2">
        <div class="w-100 bg-light bg-opacity-50 p-2 d-flex flex-row justify-content-between
            align-items-center">
            <p class="ps-2 m-0 col-6 text-white">Board</p>
            <v-icon name="la-ellipsis-h-solid" scale="1.3" fill="white" />
        </div>
        <div class="bg-light bg-opacity-50 col-6 col-sm-3  rounded d-flex flex-row 
            justify-content-start align-items-center gap-2 p-2 m-3">
            <v-icon name="hi-plus-sm" scale="1" fill="white" />
            <p class="text-white p-0 m-0">Add a list</p>
        </div>
    </div>
</template>

<script setup>
</script>

<style scoped>
div.structure-container-card-detail-body-container-img .overlay {
    background-color: rgba(0, 0, 0, 0.5);
}

div.image-user {
    width: 40px;
    height: 40px;
}
</style>