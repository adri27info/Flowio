<template>
    <div class="w-100 d-flex flex-column justify-content-center align-items-center">
        <h4 class="w-100 text-center mt-4">Enter your information to login.</h4>
        <form class="form-login bg-white border border-dark border-2 p-2 mt-3 mb-5" @submit.prevent="handleForm"
            enctype="multipart/form-data">
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="emailLogin" class="form-label fw-bold">Email <span class="text-danger">*</span></label>
                <input type="text" class="form-control border border-dark border-1 text-center mb-2" id="emailLogin"
                    placeholder="Enter your email" v-model="storeForm.formData.login.email"
                    @input="storeForm.validateEmail('login')">
                <p class="w-100 text-center text-danger mt-2 fw-bold text-danger">
                    {{ storeForm.formErrors.login.email }}
                </p>
            </div>
            <div class="d-flex flex-column justify-content-center align-items-center mb-4">
                <label for="password" class="form-label fw-bold">Password <span class="text-danger">*</span></label>
                <input type="password" class="form-control border border-dark border-1 text-center" id="password"
                    placeholder="Enter your password" v-model="storeForm.formData.login.password"
                    @input="storeForm.validatePassword('login')">
                <p class="w-100 text-center text-danger mt-2 fw-bold">
                    {{ storeForm.formErrors.login.password }}
                </p>
            </div>
            <p class="w-100 text-center showErrorForm fw-bold mb-4 text-danger">
                {{ storeForm.formErrors.login.form }}
            </p>
            <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
                <template #response-api>
                    <p v-if="storeApp.getResponseApi('user.login').message && !storeApp.getResponseApi('user.login').message.id"
                        :class="storeApp.getResponseApi('user.login').class" class="w-100 text-center fw-bold">
                        {{ storeApp.getResponseApi('user.login').message }}
                    </p>
                </template>
            </ResponseApiComponent>
            <button type="submit" class="btn btn-primary w-75 d-block m-auto btnLogin">Submit</button>
        </form>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useFormHandler } from "@/composables/useFormHandler";
import userStore from "@/stores/user/userStore";
import appStore from '@/stores/general/appStore';
import formStore from '@/stores/general/formStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const { loading, withLoading } = useLoading();
const { handleFormSubmit } = useFormHandler(withLoading);
const storeUser = userStore();
const storeApp = appStore()
const storeForm = formStore()
const entity = "user.login"

const handleForm = async (e) => {
    const classList = e.target.classList;
    const formHandlers = {
        "form-login": {
            fields: ["email", "password"],
            action: () => storeUser.loginUser(storeForm.fillFormData("login")),
            btnName: "btnLogin",
            keyForm: "login",
            entity: "user.login",
            errorMessages: () => storeForm.errorValidations.login.form.requiredFields,
            optionsRedirection: { routeName: "workspaces" },
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
    storeForm.clearForm("login")
})
</script>

<style scoped>
form.form-login {
    max-width: 600px;
    width: 90%;
}
</style>