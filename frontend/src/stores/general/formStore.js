import { defineStore } from "pinia";
import { useValidationFormUtils } from "@/composables/useValidationFormUtils";
import userStore from "@/stores/user/userStore";
import appStore from "@/stores/general/appStore";
import boardStore from "../board/boardStore";
import structureStore from "@/stores/structure/structureStore";

const { validations, formData, formErrors } = useValidationFormUtils();

const formStore = defineStore("formStore", {
  state: () => ({
    formToReset: "",
    errorValidations: {
      login: {
        email: validations.email,
        form: {
          requiredFields: validations.requiredFields,
        },
        empty: validations.empty,
      },
      register: {
        email: validations.email,
        password: validations.password,
        profileImage: validations.profileImage,
        form: validations.form,
        empty: validations.empty,
      },
      resend: {
        email: validations.email,
        form: {
          requiredFields: validations.requiredFields,
        },
        empty: validations.empty,
      },
      activation: {
        email: validations.email,
        form: {
          requiredFields: validations.requiredFields,
        },
        empty: validations.empty,
      },
      editUser: {
        email: validations.email,
        password: validations.password,
        profileImage: validations.profileImage,
        form: validations.form,
        empty: validations.empty,
      },
      createWorkspace: {
        form: validations.form,
        empty: validations.empty,
      },
      editWorkspace: {
        form: validations.form,
        empty: validations.empty,
      },
      createBoard: {
        form: validations.form,
        empty: validations.empty,
      },
      editBoard: {
        form: validations.form,
        empty: validations.empty,
      },
      createList: {
        form: validations.form,
        empty: validations.empty,
      },
      editList: {
        form: validations.form,
        empty: validations.empty,
      },
      createCard: {
        form: validations.form,
        empty: validations.empty,
      },
      editCard: {
        form: validations.form,
        empty: validations.empty,
      },
    },
    formData: {
      login: {
        email: formData.email,
        password: formData.password,
      },
      register: {
        name: formData.name,
        surnames: formData.surnames,
        email: formData.email,
        password: formData.password,
        role_id: "",
        profileImage: null,
        changeForms: {
          ownForm: true,
          activationCodeForm: false,
          resendCodeForm: false,
        },
        titlesForms: {
          ownForm: "Enter your information to register.",
          activationCodeForm: "Enter the activation code sent to your email.",
          resendCodeForm: "Enter your email to resend you the activation code.",
        },
      },
      resend: {
        email: formData.email,
      },
      activation: {
        email: formData.email,
        activationCode: "",
        activation_code: "",
      },
      editUser: {
        name: formData.name,
        surnames: formData.surnames,
        password: formData.password,
        profileImage: null,
      },
      createWorkspace: {
        name: formData.name,
        description: formData.description,
        background_workspace_id: formData.background_workspace_id,
      },
      editWorkspace: {
        name: formData.name,
        description: formData.description,
      },
      createBoard: {
        name: formData.name,
        description: formData.description,
        workspace_id: formData.workspace_id,
      },
      editBoard: {
        name: formData.name,
        description: formData.description,
        workspace_id: formData.workspace_id,
        structure_id: formData.structure_id,
      },
      createList: {
        title: formData.title,
      },
      editList: {
        title: formData.title,
      },
      createCard: {
        title: formData.title,
      },
      editCard: {
        title: formData.title,
      },
    },
    formErrors: {
      login: {
        email: formErrors.email,
        password: formErrors.password,
        form: formErrors.form,
      },
      register: {
        name: formErrors.name,
        surnames: formErrors.surnames,
        email: formErrors.email,
        password: formErrors.password,
        profileImage: "",
        form: formErrors.form,
      },
      resend: {
        email: formErrors.email,
        form: formErrors.form,
      },
      activation: {
        email: formErrors.email,
        activationCode: "",
        form: formErrors.form,
      },
      editUser: {
        name: formErrors.name,
        surnames: formErrors.surnames,
        password: formErrors.password,
        profileImage: "",
        form: formErrors.form,
      },
      createWorkspace: {
        name: formErrors.name,
        description: formErrors.description,
        background_workspace_id: formErrors.background_workspace_id,
        form: formErrors.form,
      },
      editWorkspace: {
        name: formErrors.name,
        description: formErrors.description,
        form: formErrors.form,
      },
      createBoard: {
        name: formErrors.name,
        description: formErrors.description,
        workspace_id: formErrors.workspace_id,
        form: formErrors.form,
      },
      editBoard: {
        name: formErrors.name,
        description: formErrors.description,
        workspace_id: formErrors.workspace_id,
        structure_id: formErrors.structure_id,
        form: formErrors.form,
      },
      createList: {
        title: formErrors.title,
        form: formErrors.form,
      },
      editList: {
        title: formErrors.title,
        form: formErrors.form,
      },
      createCard: {
        title: formErrors.title,
        form: formErrors.form,
      },
      editCard: {
        title: formErrors.title,
        form: formErrors.form,
      },
    },
  }),

  getters: {
    getUserStore() {
      return userStore();
    },
    getAppStore() {
      return appStore();
    },
    getBoardStore() {
      return boardStore();
    },
    getStructureStore() {
      return structureStore();
    },
    getFormToReset(state) {
      return state.formToReset;
    },
    canSubmitForm:
      (state) =>
      (formType, fields = null) => {
        const formData = state.formData[formType];
        const formErrors = state.formErrors[formType];

        if (fields) {
          return fields.every((field) => {
            const fieldValue = String(formData[field])?.trim();
            return (
              (typeof field === "function" ? field() : fieldValue) &&
              !formErrors[field]
            );
          });
        }
      },
  },

  actions: {
    setFormToReset(value) {
      this.formToReset = value;
    },

    capitalizeAndFormat(text) {
      if (!text) return "";

      let formattedText = text
        .replace(/_/g, " ")
        .replace(/([A-Z])/g, " $1")
        .toLowerCase();

      formattedText = formattedText.replace(/\bid\b/g, "");
      formattedText = formattedText.replace(/^./, (str) => str.toUpperCase());

      return formattedText;
    },

    checkFormType(formType) {
      if (!this.formData[formType] || !this.formErrors[formType]) {
        return false;
      }
      return true;
    },

    setActiveForm(formName) {
      for (let key in this.formData.register.changeForms) {
        this.formData.register.changeForms[key] = false;
      }
      this.formData.register.changeForms[formName] = true;
    },

    validateField(formType, field, regex = null) {
      if (!this.checkFormType(formType)) {
        return;
      }

      const trimmedValue = String(this.formData[formType][field])?.trim() || "";

      if (trimmedValue === "") {
        this.formErrors[formType][field] = `${this.capitalizeAndFormat(
          field
        )} ${this.errorValidations[formType].empty}`;
      } else if (regex && !regex.test(trimmedValue)) {
        this.formErrors[formType][field] =
          this.errorValidations[formType][field] || "Invalid format.";
      } else {
        this.formErrors[formType][field] = "";
      }
    },

    validateName(formType) {
      this.validateField(formType, "name");
    },

    validateTitle(formType) {
      this.validateField(formType, "title");
    },

    validateSurnames(formType) {
      this.validateField(formType, "surnames");
    },

    validateDescription(formType) {
      this.validateField(formType, "description");
    },

    validateActivationCode(formType) {
      this.validateField(formType, "activationCode");
    },

    validateBackgroundWorkspace(formType) {
      this.validateField(formType, "background_workspace_id");
    },

    validateWorkspace(formType) {
      this.validateField(formType, "workspace_id");
    },

    validateEmail(formType) {
      this.validateField(formType, "email", this.getAppStore.getRegexs.email);
    },

    validatePassword(formType) {
      if (!this.checkFormType(formType)) {
        return;
      }

      const storeApp = this.getAppStore;
      const password = this.formData[formType].password.trim();
      const validations = {
        empty: `Password ${this.errorValidations[formType].empty}`,
        length: this.errorValidations[formType].password?.length,
        uppercase: this.errorValidations[formType].password?.uppercase,
        number: this.errorValidations[formType].password?.number,
        specialChar: this.errorValidations[formType].password?.specialChar,
      };

      if (password === "") {
        this.formErrors[formType].password = validations.empty;
        return;
      }

      if (formType === "register" || formType == "editUser") {
        const { uppercase, number, specialChar } = storeApp.getRegexs.password;
        const passwordRules = [
          {
            test: (password) => password.length < 8 || password.length > 20,
            message: validations.length,
          },
          {
            test: (password) => !uppercase.test(password),
            message: validations.uppercase,
          },
          {
            test: (password) => !number.test(password),
            message: validations.number,
          },
          {
            test: (password) => !specialChar.test(password),
            message: validations.specialChar,
          },
        ];

        for (let rule of passwordRules) {
          if (rule.test(password)) {
            this.formErrors[formType].password = rule.message;
            return;
          }
        }
      }

      this.formErrors[formType].password = "";
    },

    validateImage(file, profileImageValidation) {
      const { sizeLimit, typeImage, size, type } = profileImageValidation;

      if (file.size > sizeLimit) {
        return size;
      }

      if (!typeImage.includes(file.type)) {
        return type;
      }

      return null;
    },

    validateAllFields(formType) {
      if (!this.checkFormType(formType)) {
        return;
      }

      const forms = {
        login: [
          () => this.validateEmail(formType),
          () => this.validatePassword(formType),
        ],
        register: [
          () => this.validateName(formType),
          () => this.validateSurnames(formType),
          () => this.validateEmail(formType),
          () => this.validatePassword(formType),
        ],
        activation: [
          () => this.validateEmail(formType),
          () => this.validateActivationCode(formType),
        ],
        resend: [() => this.validateEmail(formType)],
        editUser: [
          () => this.validateName(formType),
          () => this.validateSurnames(formType),
          () => this.validatePassword(formType),
        ],
        createWorkspace: [
          () => this.validateName(formType),
          () => this.validateDescription(formType),
          () => this.validateBackgroundWorkspace(formType),
        ],
        editWorkspace: [
          () => this.validateName(formType),
          () => this.validateDescription(formType),
        ],
        createBoard: [
          () => this.validateName(formType),
          () => this.validateDescription(formType),
          () => this.validateWorkspace(formType),
        ],
        editBoard: [
          () => this.validateName(formType),
          () => this.validateDescription(formType),
          () => this.validateWorkspace(formType),
        ],
        createList: [() => this.validateTitle(formType)],
        editList: [() => this.validateTitle(formType)],
        createCard: [() => this.validateTitle(formType)],
        editCard: [() => this.validateTitle(formType)],
      };

      if (forms[formType]) {
        forms[formType].forEach((fn) => fn());
      }
    },

    handleFileUpload(event, formType) {
      if (!this.checkFormType(formType)) {
        return;
      }

      const file = event.target.files[0];
      if (!file) return;

      const profileImageValidation =
        this.errorValidations[formType].profileImage;
      const validationError = this.validateImage(file, profileImageValidation);

      if (validationError) {
        this.formErrors[formType].profileImage = validationError;
      } else {
        this.formErrors[formType].profileImage = "";
        this.formData[formType].profileImage = file;
      }
    },

    clearFile(formType, profileImageReference) {
      if (!this.checkFormType(formType)) {
        return;
      }

      if (profileImageReference.value) {
        profileImageReference.value.value = "";

        if (
          this.formErrors[formType].form ==
          this.errorValidations[formType].form.image
        ) {
          this.formErrors[formType].form = "";
        }
        this.formErrors[formType].profileImage = "";
        this.formData[formType].profileImage = null;
      }
    },

    changeForm(event, formType, titleFormRef) {
      if (!this.checkFormType(formType)) {
        return;
      }

      const formsButtons = {
        register: {
          btnRegisterToActivation: () => {
            this.formData.register.changeForms.ownForm = false;
            this.formData.register.changeForms.activationCodeForm = true;
            titleFormRef.value.textContent =
              this.formData.register.titlesForms.activationCodeForm;
          },
          btnRegisterToResend: () => {
            this.formData.register.changeForms.ownForm = false;
            this.formData.register.changeForms.resendCodeForm = true;
            titleFormRef.value.textContent =
              this.formData.register.titlesForms.resendCodeForm;
          },
        },
        activation: {
          btnActivationToRegister: () => {
            this.formData.register.changeForms.ownForm = true;
            this.formData.register.changeForms.activationCodeForm = false;
            titleFormRef.value.textContent =
              this.formData.register.titlesForms.ownForm;
          },
        },
        resend: {
          btnResendToRegister: () => {
            this.formData.register.changeForms.ownForm = true;
            this.formData.register.changeForms.resendCodeForm = false;
            titleFormRef.value.textContent =
              this.formData.register.titlesForms.ownForm;
          },
        },
      };

      const matchingClass = Object.keys(formsButtons[formType]).find((cls) => {
        return event.target.classList.contains(cls);
      });

      event.target.form
        .querySelector('button[type="submit"]')
        .classList.remove("disabled");

      if (matchingClass) {
        formsButtons[formType][matchingClass]();
      }
    },

    fillFormData(formType) {
      if (!this.checkFormType(formType)) {
        return;
      }

      const storeUser = this.getUserStore;
      const storeStructure = this.getStructureStore;
      const storeBoard = this.getBoardStore;
      const formDataToSend = new FormData();

      const formMapping = {
        login: ["email", "password"],
        register: [
          "name",
          "surnames",
          "email",
          "password",
          "role_id",
          "profileImage",
        ],
        activation: ["email", "activation_code"],
        resend: ["email"],
        editUser: ["name", "surnames", "password", "profileImage"],
        createWorkspace: [
          "name",
          "description",
          "user_id",
          "background_workspace_id",
        ],
        editWorkspace: [
          "name",
          "description",
          "background_workspace_id",
          "user_id",
        ],
        createBoard: ["name", "description", "workspace_id", "structure_id"],
        editBoard: ["name", "description", "workspace_id", "structure_id"],
        createList: ["title", "board_id"],
        editList: ["title", "board_id"],
        createCard: ["title", "description", "list_id"],
        editCard: ["title", "description", "list_id"],
      };

      const form = this.formData[formType];
      const customKeys = {
        role_id: 2,
        activation_code: form["activationCode"],
        user_id: storeUser.getIdUser,
        structure_id: storeStructure.getStructureId,
        board_id: storeBoard.getBoardId,
        list_id: storeBoard.getListId,
      };

      formMapping[formType]?.forEach((key) => {
        const value = customKeys[key] || form[key];

        if (value) {
          formDataToSend.append(
            key === "profileImage" ? "attachment" : key,
            value
          );
        }
      });

      return formDataToSend;
    },

    clearForm(formType, profileImageRef = null) {
      if (!this.checkFormType(formType)) {
        return;
      }

      [this.formData[formType], this.formErrors[formType]].forEach(
        (formSection) => {
          Object.keys(formSection).forEach((key) => {
            if (
              typeof formSection[key] != "object" ||
              formSection[key] instanceof File
            )
              formSection[key] = "";
          });
        }
      );

      if (profileImageRef && profileImageRef.value) {
        profileImageRef.value.value = "";
      }
    },
  },
});

export default formStore;
