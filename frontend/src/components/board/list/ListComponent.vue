<template>
    <div class="container-board__body w-100 p-2 position-relative z-2">
        <div class="container-board__body-lists w-100 min-vh-100 d-flex flex-row 
            justify-content-start align-items-start gap-3 p-2 overflow-x-auto">
            <div v-if="board.lists.length > 0" class="d-flex flex-row justify-content-start
                align-items-start gap-4 w-100">
                <template v-for="(list, indexList) in board.lists" :key="indexList">
                    <div @dragover="handleDragOver" @drop="handleDrop(indexList, $event)" @dragenter="handleDragEnter"
                        class="container-board__body-lists-list bg-light flex-shrink-0 gap-2 p-2 rounded">
                        <div class="d-flex flex-row justify-content-between align-items-center gap-2 pb-3">
                            <div class="d-flex flex-row justify-content-center align-items-center gap-2">
                                <v-icon name="md-formatlistbulleted" scale="1" fill="black" data-bs-toggle="dropdown" />
                                <p class="text-black p-0 m-0 ps-1 fs-5">{{ getTruncatedName(list.title, 20) }}</p>
                            </div>
                            <v-icon name="la-angle-down-solid" scale="1" fill="black" data-bs-toggle="dropdown" />
                            <ul class="dropdown-menu">
                                <li>
                                    <button class="dropdown-item" @click="editList(list.id)">
                                        Edit list
                                    </button>
                                </li>
                                <li>
                                    <button class="dropdown-item" @click="deleteList(list.id)">
                                        Delete list
                                    </button>
                                </li>
                            </ul>
                        </div>
                        <template v-if="list.cards.length > 0">
                            <div class="d-flex flex-column gap-4">
                                <div v-for="(card, indexCard) in list.cards" :key="indexCard" class="bg-white 
                                    mb-2 d-flex flex-row justify-content-between align-items-center custom-border 
                                    neumorphism container-card" :draggable="true" :data-index="indexCard"
                                    @dragstart="handleDragStart(indexList, indexCard)">
                                    <div class="d-flex flex-row justify-content-start align-items-center gap-2
                                        container-card-item" @click="retrieveCard(card.id, list.title)">
                                        <input type="checkbox" name="checkTask" id="checkTask" :checked="card.completed"
                                            @click.stop="handleCheck(card.id, $event)">
                                        <v-icon name="bi-card-checklist" scale="1" fill="black" />
                                        <p class=" text-dark m-0">{{ getTruncatedName(card.title, 20) }}</p>
                                    </div>
                                    <v-icon name="la-angle-down-solid" scale="1" fill="black"
                                        data-bs-toggle="dropdown" />
                                    <ul class="dropdown-menu">
                                        <li>
                                            <button class="dropdown-item" @click="editCard(card.id, list.id)">
                                                Edit card
                                            </button>
                                        </li>
                                        <li>
                                            <button class="dropdown-item" @click="deleteCard(card.id, list.id)">
                                                Delete card
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="w-100 d-flex flex-row justify-content-start 
                                align-items-center rounded p-2 bg-dark flex-shrink-0 gap-2
                                custom-border neumorphism custom-container-add mt-4">
                                <v-icon name="hi-plus-sm" scale="1" fill="white" @click="createCard(list.id)" />
                                <p class="text-white p-0 m-0">Add a card</p>
                            </div>
                        </template>
                        <template v-else>
                            <div class="w-100 d-flex flex-row justify-content-start 
                                align-items-center rounded p-2 bg-dark flex-shrink-0 gap-2
                                custom-border neumorphism">
                                <v-icon name="hi-plus-sm" scale="1" fill="white" @click="createCard(list.id)" />
                                <p class="text-white p-0 m-0">Add a card</p>
                            </div>
                        </template>
                    </div>
                    <div v-if="indexList === board.lists.length - 1" class="container-board__body-lists-list 
                        d-flex flex-row justify-content-start align-items-center rounded p-2 bg-light 
                        bg-opacity-50 flex-shrink-0 gap-2">
                        <v-icon name="hi-plus-sm" scale="1" fill="white" @click="createList" />
                        <p class="text-white p-0 m-0">Add a list</p>
                    </div>
                </template>
            </div>
            <div v-else class="container-board__body-lists-list d-flex flex-row justify-content-start 
                align-items-center rounded p-2 bg-light bg-opacity-50 flex-shrink-0 gap-2">
                <v-icon name="hi-plus-sm" scale="1" fill="white" @click="createList" />
                <p class="text-white p-0 m-0">Add a list</p>
            </div>
            <div class="container-board__body-dropdown-menu"
                :class="{ 'container-board__body-dropdown-menu--active': props.menuOpen }" @click.stop>
                <div class="container-board__body-dropdown-menu__content p-2">
                    <div class="container-board__body-dropdown-menu__content-header">
                        <h4 class="text-center">Menu</h4>
                    </div>
                    <hr class="w-100" />
                    <div class="container-board__body-dropdown-menu__content-body d-flex flex-column
                        justify-content-center align-items-start gap-3">
                        <div class="container-board__body-dropdown-menu__content-body-item d-flex 
                            flex-row justify-content-start align-items-center gap-3 ps-2 w-100">
                            <v-icon name="fa-info-circle" scale="1" fill="black" />
                            <button class="bg-white border-0 link-opacity-75-hover 
                                text-black text-decoration-none" @click="retrieveBoard">
                                Info
                            </button>
                        </div>
                        <div class="container-board__body-dropdown-menu__content-body-item d-flex 
                            flex-row justify-content-start align-items-center gap-3 ps-2 w-100">
                            <v-icon name="la-user-edit-solid" scale="1" fill="black" />
                            <button class="bg-white border-0 link-opacity-75-hover 
                                text-black text-decoration-none" @click="editBoard">
                                Edit board
                            </button>
                        </div>
                        <div class="container-board__body-dropdown-menu__content-body-item d-flex 
                            flex-row justify-content-start align-items-center gap-3 ps-2 w-100">
                            <v-icon name="ri-delete-bin-2-line" scale="1" fill="black" />
                            <button class="bg-white border-0 link-opacity-75-hover 
                                text-black text-decoration-none" @click="deleteBoard">
                                Delete board
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <ModalComponent :showModal="storeApp.getModal" :action="storeApp.getActionModal" />
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useUtilsWorkspace } from '@/composables/useUtilsWorkspace';
import appStore from "@/stores/general/appStore";
import userStore from "@/stores/user/userStore";
import boardStore from "@/stores/board/boardStore";
import ModalComponent from '@/components/modals/ModalComponent.vue';

const props = defineProps({
    menuOpen: {
        type: Boolean,
        required: true,
    }
});

const { getTruncatedName } = useUtilsWorkspace();
const storeApp = appStore();
const storeUser = userStore()
const storeBoard = boardStore()
const dragItem = ref(null);
const dragItemIndex = ref(null);

const board = computed(() => storeApp.responseApi.board.retrieve.message);

watch(() => board.value, async (newBoard, oldBoard) => {
    if (!newBoard || !oldBoard) return;

    if (newBoard.lists && oldBoard.lists) {
        for (let index = 0; index < newBoard.lists.length; index++) {
            const newList = newBoard.lists[index];
            const oldList = oldBoard.lists[index];

            if (oldList) {
                for (const newCard of newList.cards) {
                    const oldCard = oldList.cards.find((card) => card.id === newCard.id);
                    if (oldCard) {
                        if (newCard.completed !== oldCard.completed) {
                            await storeBoard.retrieveCard(newCard.id);
                        }
                    }
                }
            }
        }
    }
}, { deep: true });

const handleDragEnter = (event) => {
    event.preventDefault();
};

const handleDragOver = (event) => {
    event.preventDefault();
};

const handleDragStart = (indexItem, indexCard) => {
    dragItem.value = board.value.lists[indexItem].cards[indexCard]
    dragItemIndex.value = { indexItem, indexCard };
};

const handleDrop = async (toIndexItem, event) => {
    const { indexItem: fromIndexItem, indexCard: fromIndexCard } = dragItemIndex.value;
    const toIndexCard = parseInt(event.target.getAttribute('data-index'))

    const cards = [...board.value.lists[toIndexItem].cards];
    const draggedCard = board.value.lists[fromIndexItem].cards.splice(fromIndexCard, 1)[0];
    board.value.lists[toIndexItem].cards.splice(toIndexCard, 0, draggedCard);

    const positionChanged = cards.some((card, index) => card.id !== board.value.lists[toIndexItem].cards[index].id);
    const updates = [];

    if (fromIndexItem !== toIndexItem) {
        await storeBoard.createTrace({
            'user_id': storeUser.getIdUser,
            'card_id': draggedCard.id,
            "description": `Moved to ${board.value.lists[toIndexItem].title} list`
        })

        const update = { card_id: draggedCard.id, list_id: board.value.lists[toIndexItem].id };
        if (!positionChanged) update.order = 1

        updates.push(update);
        await storeBoard.retrieveCard(draggedCard.id);
    }

    if (positionChanged) {
        board.value.lists[toIndexItem].cards.forEach((card, index) => {
            updates.push({ card_id: card.id, order: index + 1 });
        });
    }

    if (updates.length > 0) {
        await storeBoard.batchCard(updates);
    }

    dragItem.value = null;
    dragItemIndex.value = null;
};

const handleCheck = async (cardId, event) => {
    await storeBoard.partialUpdateCard(cardId, getFormDataCardCompleted(event));
    await storeBoard.createTrace(getFormDataTrace({
        'user_id': storeUser.getIdUser,
        'card_id': cardId,
        "description": event.target.checked
            ? "Marked this card as completed"
            : "Marked this card as incomplete"
    }))
    await storeBoard.retrieveBoard(storeBoard.getBoardId);
};

const retrieveBoard = () => {
    storeApp.setModal({ value: true, action: "retrieveBoard" });
};

const editBoard = () => {
    storeApp.setModal({ value: true, action: "editBoard" });
};

const deleteBoard = () => {
    storeApp.setModal({ value: true, action: "deleteBoard" });
};

const createList = () => {
    storeApp.setModal({ value: true, action: "createList" });
}

const editList = (listId) => {
    storeBoard.setListId(listId)
    storeApp.setModal({ value: true, action: "editList" });
}

const deleteList = (listId) => {
    storeBoard.setListId(listId)
    storeApp.setModal({ value: true, action: "deleteList" });
}

const createCard = (listId) => {
    storeBoard.setListId(listId)
    storeApp.setModal({ value: true, action: "createCard" });
}

const retrieveCard = (listCard, listTitle) => {
    storeBoard.setCardId(listCard)
    storeBoard.setListTitle(listTitle)
    storeApp.setModal({ value: true, action: "retrieveCard" });
}

const editCard = (listCard, listId) => {
    storeBoard.setCardId(listCard)
    storeBoard.setListId(listId)
    storeApp.setModal({ value: true, action: "editCard" });
}

const deleteCard = (listCard, listId) => {
    storeBoard.setCardId(listCard)
    storeBoard.setListId(listId)
    storeApp.setModal({ value: true, action: "deleteCard" });
}

const getFormDataCardCompleted = (event) => {
    const formData = new FormData();
    formData.append("completed", event.target.checked);
    return formData
}

const getFormDataTrace = (data) => {
    const formDataTrace = new FormData();
    formDataTrace.append("user_id", data.user_id);
    formDataTrace.append("card_id", data.card_id);
    formDataTrace.append("description", data.description);
    return formDataTrace
}
</script>

<style scoped>
div.container-board__body-lists-list {
    width: 320px;
}

div.container-board__body-dropdown-menu {
    position: absolute;
    top: 0;
    right: 0;
    background: white;
    padding: 10px;
    width: 320px;
    opacity: 0;
    transform: translateX(10px);
    z-index: 10;
    transition: opacity 0.3s ease, transform 0.3s ease;
    visibility: hidden;
    display: none;
    height: 100%;
}

div.container-board__body-dropdown-menu--active {
    opacity: 1;
    transform: translateX(0);
    visibility: visible;
    display: block;
    pointer-events: auto;
}

.custom-border {
    border-radius: 12px;
    padding: 12px;
    transition: all 0.3s ease-in-out;
}

.neumorphism {
    border: none;
    background: #e0e0e0;
    box-shadow: 6px 6px 12px #969696, -6px -6px 12px #ffffff;
}

.custom-container-add {
    background: #f0e5e5;
}

.container-card:hover {
    background: #e9e7e7 !important;
}

.container-card-item:hover {
    cursor: pointer;
}

@media (max-width: 330px) {
    div.container-board__body-dropdown-menu {
        width: 100%;
    }
}
</style>
