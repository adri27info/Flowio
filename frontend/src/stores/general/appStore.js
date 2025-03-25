import { defineStore } from "pinia";
import { useTimeout } from "@/composables/useTimeout";
import { useModalRestore } from "@/composables/useModalRestore";
import { useRedirectWithDelay } from "@/composables/useRedirectWithDelay";
import { useEnvironment } from "@/composables/useEnvironment";

const cloudfrontImages = useEnvironment();

const appStore = defineStore("appStore", {
  state: () => ({
    responseApi: {
      user: {
        token: { message: "", error: "" },
        login: { message: "", error: "" },
        register: { message: "", error: "" },
        retrieve: { message: "", error: "" },
        update: { message: "", error: "" },
        delete: { message: "", error: "" },
        logout: { message: "", error: "" },
      },
      structure: {
        list: { message: "", error: "" },
      },
      workspace: {
        list: { message: "", error: "" },
        retrieve: { message: "", error: "" },
        create: { message: "", error: "" },
        update: { message: "", error: "" },
        delete: { message: "", error: "" },
      },
      bgWorkspace: {
        list: { message: "", error: "" },
      },
      board: {
        create: { message: "", error: "" },
        retrieve: { message: "", error: "" },
        update: { message: "", error: "" },
        delete: { message: "", error: "" },
      },
      list: {
        create: { message: "", error: "" },
        update: { message: "", error: "" },
        delete: { message: "", error: "" },
      },
      card: {
        create: { message: "", error: "" },
        retrieve: { message: "", error: "" },
        update: { message: "", error: "" },
        partial: { message: "", error: "" },
        batch: { message: "", error: "" },
        delete: { message: "", error: "" },
      },
      trace: {
        create: { message: "", error: "" },
      },
    },
    entity: {
      user: {
        token: false,
        login: false,
        register: false,
        retrieve: false,
        update: false,
        delete: false,
        logout: false,
      },
      structure: {
        list: false,
      },
      workspace: {
        list: false,
        retrieve: false,
        create: false,
        update: false,
        delete: false,
      },
      bgWorkspace: {
        list: false,
      },
      board: {
        create: false,
        retrieve: false,
        update: false,
        delete: false,
      },
      list: {
        create: false,
        update: false,
        delete: false,
      },
      card: {
        create: false,
        retrieve: false,
        update: false,
        partial: false,
        batch: false,
        delete: false,
      },
      trace: {
        create: false,
      },
    },
    msgModal: "",
    regexs: {
      email:
        /^(?!-)(?!.*--)[A-Za-z0-9!#$%&'*+/=?^_{|}~.-]+(?:[A-Za-z0-9])?@[A-Za-z0-9-]+\.[A-Za-z0-9-.]{2,63}$/,
      password: {
        uppercase: /[A-Z]/,
        number: /\d/,
        specialChar: /[\W_]/,
      },
    },
    modal: false,
    actionModal: "",
    modalObj: "",
    roleUser: "",
    defaultLogoImageUrl: cloudfrontImages.logo,
    defaultProfileImageUrl: cloudfrontImages.profileUser,
    defaultWorkspaceLogoModalImagelUrl: cloudfrontImages.workspaceLogo,
    defaultWorkspaceBGModalImageUrl: cloudfrontImages.workspaceBG,
    timeout: useTimeout(),
    modalRestore: useModalRestore(),
    redirect: useRedirectWithDelay(),
  }),

  getters: {
    getResponseApi: (state) => (entity) => {
      if (!entity) return;

      const keys = entity.split(".");
      let response = state.responseApi;

      for (const key of keys) {
        response = response[key];
        if (response === undefined) return null;
      }

      if (response.message) {
        return { message: response.message, class: "text-success" };
      } else if (response.error) {
        return { message: response.error, class: "text-danger" };
      }

      return null;
    },

    getEntity: (state) => (entity) => {
      if (!entity) return;

      const keys = entity.split(".");
      let obj = state.entity;

      for (let i = 0; i < keys.length; i++) {
        if (obj && obj[keys[i]] !== undefined) {
          obj = obj[keys[i]];
        } else {
          return undefined;
        }
      }

      return obj ? entity : false;
    },
    getMsgModal(state) {
      return state.msgModal;
    },
    getRegexs(state) {
      return state.regexs;
    },
    getModal(state) {
      return state.modal;
    },
    getActionModal(state) {
      return state.actionModal;
    },
    getModalObj(state) {
      return state.modalObj;
    },
    getRoleUser(state) {
      return state.roleUser == 1 ? "Admin" : "User";
    },
    getDefaultLogoImageUrl(state) {
      return state.defaultLogoImageUrl;
    },
    getDefaultProfileImageUrl(state) {
      return state.defaultProfileImageUrl;
    },
    getDefaultWorkspaceLogoModal(state) {
      return state.defaultWorkspaceLogoModalImagelUrl;
    },
    getDefaultWorkspaceBGModal(state) {
      return state.defaultWorkspaceBGModalImageUrl;
    },
  },

  actions: {
    setResponseApi(entity) {
      if (entity) {
        const keys = entity.split(".");
        let response = this.responseApi;

        for (const key of keys) {
          response = response[key];
          if (response === undefined) return null;
        }

        response.error = "";
        response.message = "";
      } else {
        Object.values(this.responseApi).forEach((obj) => {
          Object.values(obj).forEach((nestedObj) => {
            if (nestedObj) {
              nestedObj.message = "";
              nestedObj.error = "";
            }
          });
        });
      }
    },

    setEntity(entity) {
      if (entity) {
        const keys = entity.split(".");
        let obj = this.entity;
        keys.slice(0, -1).forEach((key) => {
          obj = obj[key];
        });
        obj[keys[keys.length - 1]] = true;
      } else {
        const resetEntity = (obj) => {
          Object.keys(obj).forEach((key) => {
            if (typeof obj[key] === "object") {
              resetEntity(obj[key]);
            } else {
              obj[key] = false;
            }
          });
        };
        resetEntity(this.entity);
      }
    },

    setMsgModal(value) {
      this.msgModal = value;
    },

    setModal({ value, message = "", action = "listMessage" }) {
      this.modal = value;
      this.setMsgModal(message);
      this.setActionModal(action);
    },

    setActionModal(value) {
      this.actionModal = value;
    },

    setModalObj(value) {
      this.modalObj = value;
    },

    setRoleUser(value) {
      this.roleUser = value;
    },
  },
});

export default appStore;
