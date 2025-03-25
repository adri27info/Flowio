<template>
    <div class="w-100 d-flex flex-column justify-content-center align-items-center">
        <h4 ref="titleFormRef" class="w-100 text-center mt-4">Enter your information to register.</h4>
        <form v-if="changeForms.ownForm" class="form-register bg-white border border-dark border-2 p-2 mt-3 mb-5"
            @submit.prevent="handleForm" enctype="multipart/form-data">
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="name" class="form-label fw-bold">Name <span class="text-danger">*</span></label>
                <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="name"
                    placeholder="Enter your name" v-model="storeForm.formData.register.name"
                    @input="storeForm.validateName('register')">
                <p class="w-100 text-center text-danger mt-2 fw-bold">
                    {{ storeForm.formErrors.register.name }}
                </p>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="surnames" class="form-label fw-bold">Surnames <span class="text-danger">*</span></label>
                <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="surnames"
                    placeholder="Enter your surnames" v-model="storeForm.formData.register.surnames"
                    @input="storeForm.validateSurnames('register')">
                <p class="w-100 text-center text-danger mt-2 fw-bold">
                    {{ storeForm.formErrors.register.surnames }}
                </p>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="emailRegister" class="form-label fw-bold">Email <span class="text-danger">*</span></label>
                <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="emailRegister"
                    placeholder="Enter your email" v-model="storeForm.formData.register.email"
                    @input="storeForm.validateEmail('register')">
                <p class="w-100 text-center text-danger mt-2 fw-bold text-danger">
                    {{ storeForm.formErrors.register.email }}
                </p>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="password" class="form-label fw-bold">Password <span class="text-danger">*</span></label>
                <input type="password" class="form-control border border-dark border-1 text-center" id="password"
                    placeholder="Enter your password" v-model="storeForm.formData.register.password"
                    @input="storeForm.validatePassword('register')">
                <p class="w-100 text-center text-danger mt-2 fw-bold">
                    {{ storeForm.formErrors.register.password }}
                </p>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="profileImage" class="form-label fw-bold">Profile Image</label>
                <div class="w-100 d-flex flex-row justify-content-center align-items-center gap-2">
                    <input type="file" ref="profileImageRef"
                        class="form-control border border-dark border-1 text-center" id="profileImage"
                        accept=".jpg, .jpeg, .png" @change="storeForm.handleFileUpload($event, 'register')">
                    <v-icon class="d-block align-self-center" name="md-lockreset" scale="1.2" fill="black"
                        @click="clearFile" />
                </div>
                <p class="w-100 text-center text-danger mt-2 fw-bold">
                    {{ storeForm.formErrors.register.profileImage }}
                </p>
            </div>
            <p class="w-100 text-center showErrorForm fw-bold mb-4 text-danger">
                {{ storeForm.formErrors.register.form }}
            </p>
            <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
                <template #response-api>
                    <p :class="storeApp.getResponseApi('user.register').class" class="w-100 text-center fw-bold">
                        {{ storeApp.getResponseApi('user.register').message }}
                    </p>
                </template>
            </ResponseApiComponent>
            <div class="mb-2 d-flex flex-column justify-content-center align-items-center gap-2">
                <span class="w-100 d-block text-center">
                    Are you already registered but don't remember your activation code?
                </span>
                <button type="button" class="btn btn-dark w-75 text-white mb-2 btnRegisterToActivation"
                    @click="showForm">
                    Click here
                </button>
            </div>
            <div class="mb-2 d-flex flex-column justify-content-center align-items-center gap-2">
                <span class="w-100 d-block text-center">
                    Ready to activate your account?
                </span>
                <button type="button" class="btn btn-dark w-75 text-white mb-2 btnRegisterToResend" @click="showForm">
                    Click here
                </button>
            </div>
            <button type="submit" class="btn btn-primary w-75 d-block m-auto btnRegister">Submit</button>
        </form>
        <ActivationCodeComponent :change="changeForms.activationCodeForm" :title="titleFormRef" />
        <ResendCodeComponent :change="changeForms.resendCodeForm" :title="titleFormRef" />
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useFormHandler } from "@/composables/useFormHandler";
import userStore from "@/stores/user/userStore";
import appStore from '@/stores/general/appStore';
import formStore from '@/stores/general/formStore';
import ResendCodeComponent from '@/components/forms/auth/ResendCodeComponent.vue';
import ActivationCodeComponent from '@/components/forms/auth/ActivationCodeComponent.vue';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading, withLoading } = useLoading();
const { handleFormSubmit } = useFormHandler(withLoading);
const storeUser = userStore();
const storeApp = appStore()
const storeForm = formStore()
const titleFormRef = ref({})
const profileImageRef = ref(null)
const changeForms = storeForm.formData.register.changeForms
const entity = "user.register"

const showForm = (e) => {
    storeApp.setResponseApi("");
    storeForm.changeForm(e, "register", titleFormRef)
    storeForm.clearForm('register', profileImageRef)
};

const clearFile = () => {
    storeForm.clearFile('register', profileImageRef)
}

const handleForm = async (e) => {
    const classList = e.target.classList;
    const formHandlers = {
        "form-register": {
            fields: ["name", "surnames", "email", "password", () => !storeForm.formErrors.register.profileImage],
            action: () => storeUser.registerUser(storeForm.fillFormData("register")),
            btnName: "btnRegister",
            keyForm: "register",
            entity: "user.register",
            errorMessages: () => {
                return storeForm.formErrors.register.profileImage
                    ? storeForm.errorValidations.register.form.image
                    : storeForm.errorValidations.register.form.requiredFields;
            },
        },
    };

    const matchingForm = Object.keys(formHandlers).find(cls => classList.contains(cls));
    if (matchingForm) {
        const formConfig = formHandlers[matchingForm];
        await handleFormSubmit(formConfig);
    }
};

onMounted(() => {
    storeApp.setResponseApi("");
    storeForm.setActiveForm('ownForm');
    storeForm.clearForm("register", profileImageRef)
})
</script>

<style scoped>
form.form-register {
    max-width: 600px;
    width: 90%;
}
</style>