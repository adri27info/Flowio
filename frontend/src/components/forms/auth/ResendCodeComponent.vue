<template>
    <form v-if="change" class="form-resend-code bg-white border border-dark border-2 p-2 mt-3 mb-5"
        @submit.prevent="handleForm" enctype="multipart/form-data">
        <div class="d-flex flex-column justify-content-center align-items-center ">
            <label for="emailResend" class="form-label fw-bold">Email <span class="text-danger">*</span></label>
            <input type="text" class="form-control border border-dark border-1 text-center" id="emailResend"
                placeholder="Enter your email" v-model="storeForm.formData.resend.email"
                @input="storeForm.validateEmail('resend')">
            <p class="w-100 text-center text-danger mt-2 fw-bold">
                {{ storeForm.formErrors.resend.email }}
            </p>
        </div>
        <p class="w-100 text-center showErrorForm fw-bold mb-3 text-danger">
            {{ storeForm.formErrors.resend.form }}
        </p>
        <ResponseApiComponent :loading="loading" :entity="storeApp.getEntity(entity)">
            <template #response-api>
                <p :class="storeApp.getResponseApi('user.register').class" class="w-100 text-center fw-bold">
                    {{ storeApp.getResponseApi('user.register').message }}
                </p>
            </template>
        </ResponseApiComponent>
        <button type="button" class="d-block m-auto text-center btn btn-dark w-75 text-white mb-2 btnResendToRegister"
            @click="showForm">
            Return to register
        </button>
        <button type="submit" class="btn btn-primary w-75 d-block mt-3 mx-auto btnResendCode">Submit</button>
    </form>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useLoading } from '@/composables/useLoading';
import { useFormHandler } from "@/composables/useFormHandler";
import userStore from "@/stores/user/userStore";
import appStore from '@/stores/general/appStore';
import formStore from '@/stores/general/formStore';
import ResponseApiComponent from '@/components/general/ResponseApiComponent.vue';

const props = defineProps({
    change: {
        type: Boolean,
        required: true,
    },
    title: {
        type: Object,
        required: true,
    },
});

const { loading, withLoading } = useLoading();
const { handleFormSubmit } = useFormHandler(withLoading);
const storeUser = userStore();
const storeApp = appStore()
const storeForm = formStore()
const titleFormRef = ref("");
const entity = "user.register"

const showForm = (e) => {
    titleFormRef.value = props.title
    storeApp.setResponseApi("");
    storeForm.changeForm(e, "resend", titleFormRef)
    storeForm.clearForm('resend')
};

const handleForm = async (e) => {
    const classList = e.target.classList;
    const formHandlers = {
        "form-resend-code": {
            fields: ["email"],
            action: () => storeUser.resendCodeUser(storeForm.fillFormData("resend")),
            btnName: "btnResendCode",
            keyForm: "resend",
            entity: "user.register",
            errorMessages: () => storeForm.errorValidations.resend.form.requiredFields
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
    storeForm.setActiveForm('resendCodeForm');
    storeForm.clearForm("resend")
})
</script>

<style scoped>
form.form-resend-code {
    max-width: 600px;
    width: 90%;
}
</style>