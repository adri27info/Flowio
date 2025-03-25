import { defineStore } from "pinia";
import structureService from "@/services/structure/structureService";
import useHandleErrorApi from "@/composables/useHandleErrorApi";
import userStore from "@/stores/user/userStore";
import appStore from "@/stores/general/appStore";

const structureStore = defineStore("structureStore", {
  state: () => ({
    structureId: 0,
    handleError: useHandleErrorApi().handleError,
  }),

  getters: {
    getStructureId(state) {
      return state.structureId;
    },
    getUserStore() {
      return userStore();
    },
    getAppStore() {
      return appStore();
    },
  },

  actions: {
    setStructureId(value) {
      this.structureId = value;
    },

    async getStructures() {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("structure.list");

      try {
        const response = await structureService.getStructures(
          storeUser.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.structure.list.message = response.data;
            storeApp.responseApi.structure.list.error = "";
          }
        } else {
          storeApp.responseApi.structure.list.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.getStructures();
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.structure.list.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.structure.list.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },
  },
});

export default structureStore;
