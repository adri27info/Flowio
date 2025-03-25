import { defineStore } from "pinia";
import workspaceService from "@/services/workspace/workspaceService";
import useHandleErrorApi from "@/composables/useHandleErrorApi";
import userStore from "@/stores/user/userStore";
import appStore from "@/stores/general/appStore";

const workspaceStore = defineStore("workspaceStore", {
  state: () => ({
    workspaceId: 0,
    activeComponent: "boards",
    handleError: useHandleErrorApi().handleError,
  }),

  getters: {
    getWorkspaceId(state) {
      return state.workspaceId;
    },
    getActiveComponent(state) {
      return state.activeComponent;
    },
    getUserStore() {
      return userStore();
    },
    getAppStore() {
      return appStore();
    },
  },

  actions: {
    setWorkspaceId(value) {
      this.workspaceId = value;
    },

    setActiveComponent(value) {
      this.activeComponent = value;
    },

    async getWorkspaces(idUser = this.getUserStore.getIdUser) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("workspace.list");

      try {
        const response = await workspaceService.getWorkspaces(
          idUser,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.workspace.list.message = response.data;
            storeApp.responseApi.workspace.list.error = "";
          }
        } else {
          storeApp.responseApi.workspace.list.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.getWorkspaces(storeUser.getIdUser);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.workspace.list.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.workspace.list.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async retrieveWorkspace(idWorkspace) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("workspace.retrieve");

      try {
        const response = await workspaceService.retrieveWorkspace(
          idWorkspace,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.workspace.retrieve.message = response.data;
            storeApp.responseApi.workspace.retrieve.error = "";
            this.setWorkspaceId(idWorkspace);
          }
        } else {
          storeApp.responseApi.workspace.retrieve.error =
            "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.retrieveWorkspace(idWorkspace);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.workspace.retrieve.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.workspace.retrieve.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async createWorkspace(newData) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("workspace.create");

      try {
        const response = await workspaceService.createWorkspace(
          storeUser.getToken,
          newData
        );
        if (response) {
          if (response.status === 201) {
            storeApp.responseApi.workspace.create.message =
              "Workspace created successfully";
            storeApp.responseApi.workspace.create.error = "";
          }
        } else {
          storeApp.responseApi.workspace.create.error =
            "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.createWorkspace(newData);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.workspace.create.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.workspace.create.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async updateWorkspace(idWorkspace, newData) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("workspace.update");

      try {
        const response = await workspaceService.updateWorkspace(
          idWorkspace,
          newData,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.workspace.update.message =
              "Successfully updated workspace";
            storeApp.responseApi.workspace.update.error = "";
            this.setActiveComponent("boards");
          }
        } else {
          storeApp.responseApi.workspace.update.error =
            "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.updateWorkspace(idWorkspace, newData);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.workspace.update.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.workspace.update.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async deleteWorkspace(idWorkspace) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("workspace.delete");

      try {
        const response = await workspaceService.deleteWorkspace(
          idWorkspace,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 204) {
            storeApp.responseApi.workspace.delete.message =
              "Successfully deleted workspace";
            storeApp.responseApi.workspace.delete.error = "";
          }
        } else {
          storeApp.responseApi.workspace.delete.error =
            "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.deleteWorkspace(idWorkspace);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.workspace.delete.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.workspace.delete.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async getBackgroundWorkspaces() {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("bgWorkspace.list");

      try {
        const response = await workspaceService.getBackgroundWorkspaces(
          storeUser.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.bgWorkspace.list.message = response.data;
            storeApp.responseApi.bgWorkspace.list.error = "";
          }
        } else {
          storeApp.responseApi.bgWorkspace.list.error =
            "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.getBackgroundWorkspaces();
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.bgWorkspace.list.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.bgWorkspace.list.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },
  },
});

export default workspaceStore;
