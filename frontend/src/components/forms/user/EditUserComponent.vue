<template>
    <h5 class="text-center mt-2">Edit your profile</h5>
    <hr class="mb-4" />
    <form class="form-update-user bg-white p-2" @submit.prevent="handleForm" enctype="multipart/form-data">
        <div class="d-flex flex-column justify-content-center align-items-center mb-4">
            <label for="name" class="form-label fw-bold">Name <span class="text-danger">*</span></label>
            <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="name"
                placeholder="Enter your name" v-model="storeForm.formData.editUser.name"
                @input="storeForm.validateName('editUser')">
            <p class="w-100 text-center text-danger mt-2 fw-bold">
                {{ storeForm.formErrors.editUser.name }}
            </p>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center mb-4">
            <label for="surnames" class="form-label fw-bold">Surnames <span class="text-danger">*</span></label>
            <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="surnames"
                placeholder="Enter your surnames" v-model="storeForm.formData.editUser.surnames"
                @input="storeForm.validateSurnames('editUser')">
            <p class="w-100 text-center text-danger mt-2 fw-bold">
                {{ storeForm.formErrors.editUser.surnames }}
            </p>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center mb-4">
            <label for="password" class="form-label fw-bold">Password <span class="text-danger">*</span></label>
            <input type="password" class="form-control border border-dark border-1 text-center" id="password"
                placeholder="Enter your password" v-model="storeForm.formData.editUser.password"
                @input="storeForm.validatePassword('editUser')">
            <p class="w-100 text-center text-danger mt-2 fw-bold">
                {{ storeForm.formErrors.editUser.password }}
            </p>
        </div>
        <div class="d-flex flex-column justify-content-center align-items-center mb-4">
            <label for="profileImage" class="form-label fw-bold">Profile Image</label>
            <div class="w-100 d-flex flex-row justify-content-center align-items-center gap-2">
                <input type="file" ref="profileImageRef" class="form-control border border-dark border-1 text-center"
                    id="profileImage" accept=".jpg, .jpeg, .png"
                    @change="storeForm.handleFileUpload($event, 'editUser')">
                <v-icon class="d-block align-self-center" name="md-lockreset" scale="1.2" fill="black"
                    @click="clearFile" />
            </div>
            <p class="w-100 text-center text-danger mt-2 fw-bold">
                {{ storeForm.formErrors.editUser.profileImage }}
            </p>
        </div>
        <p class="w-100 text-center showErrorForm fw-bold mb-4 text-danger">
            {{ storeForm.formErrors.editUser.form }}
        </p>
        <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
            <template #response-api>
                <p :class="storeApp.getResponseApi('user.update').class" class="w-100 text-center fw-bold">
                    {{ storeApp.getResponseApi('user.update').message }}
                </p>
            </template>
        </ResponseApiComponent>
        <div class="modal-container-buttons d-flex flex-row justify-content-center
            align-items-center gap-2">
            <button type="button" class="btn btn-secondary w-75 d-block m-auto" data-bs-dismiss="modal"
                @click="emitEvent">Close</button>
            <button type="submit" class="btn btn-warning w-75 d-block m-auto btnEditUser">Edit</button>
        </div>
    </form>
</template>

<script setup>
import { ref } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useFormHandler } from "@/composables/useFormHandler";
import userStore from "@/stores/user/userStore";
import appStore from '@/stores/general/appStore';
import formStore from '@/stores/general/formStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading, withLoading } = useLoading();
const { handleFormSubmit } = useFormHandler(withLoading);
const emit = defineEmits(['clearForm']);
const storeUser = userStore();
const storeApp = appStore()
const storeForm = formStore()
const profileImageRef = ref(null)
const entity = "user.update"

const clearFile = () => {
    storeForm.clearFile('editUser', profileImageRef)
};

const emitEvent = () => {
    emit('clearForm', profileImageRef);
}

const handleForm = async (e) => {
    const classList = e.target.classList;
    const formHandlers = {
        "form-update-user": {
            fields: ["name", "surnames", "password", () => !storeForm.formErrors.editUser.profileImage],
            action: () => storeUser.updateUser(storeUser.getIdUser, storeForm.fillFormData("editUser")),
            btnName: "btnEditUser",
            keyForm: "editUser",
            entity: "user.update",
            errorMessages: () => {
                return storeForm.formErrors.editUser.profileImage
                    ? storeForm.errorValidations.editUser.form.image
                    : storeForm.errorValidations.editUser.form.requiredFields
            },
            optionsRedirection: {
                routeName: "profile",
                delay: 1000,
                closeModal: true,
                action: "editUser"
            },
            emitEvent: { nameEvent: "clearForm", data: profileImageRef },
            extraActions: () => storeUser.retrieveUser(),
        },
    };

    const matchingForm = Object.keys(formHandlers).find(cls => classList.contains(cls));
    if (matchingForm) {
        const formConfig = formHandlers[matchingForm];
        await handleFormSubmit(formConfig, emit);
    }
};
</script>

<style scoped>
form.form-update-user {
    max-width: 600px;
    width: 90%;
    margin: auto;
}
</style>
