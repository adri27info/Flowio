import { defineStore } from "pinia";
import { jwtDecode } from "jwt-decode";
import userService from "@/services/user/userService";
import useHandleErrorApi from "@/composables/useHandleErrorApi";
import appStore from "@/stores/general/appStore";

const userStore = defineStore("userStore", {
  state: () => ({
    user: null,
    idUser: null,
    token: null,
    refreshToken: null,
    handleError: useHandleErrorApi().handleError,
  }),

  getters: {
    getIdUser(state) {
      if (!state.token) return;
      try {
        const decoded = jwtDecode(state.token);
        return decoded.user_id;
      } catch {
        return null;
      }
    },
    getUser(state) {
      return state.user;
    },
    getToken(state) {
      return state.token;
    },
    getRefreshToken(state) {
      return state.refreshToken;
    },
    getAppStore() {
      return appStore();
    },
    isAuthenticated: (state) => !!state.getToken && !!state.getIdUser,
  },

  actions: {
    clearSession() {
      const storeApp = this.getAppStore;
      this.token = null;
      this.refreshToken = null;
      this.idUser = null;
      storeApp.setResponseApi("");
    },

    async loginUser(newData) {
      const storeApp = this.getAppStore;
      storeApp.setEntity("user.login");

      try {
        const response = await userService.loginUser(newData);
        if (response) {
          if (response.status === 200) {
            this.token = response.data.access_token;
            this.refreshToken = response.data.refresh_token;
            this.idUser = this.getIdUser;
            storeApp.responseApi.user.login.message =
              response.data.message + " Redirecting ...";
            storeApp.responseApi.user.login.error = "";
            storeApp.setRoleUser(response.data.role_id);
            await this.retrieveUser();
          }
        } else {
          storeApp.responseApi.user.login.error = "Server response error.";
        }
      } catch (err) {
        storeApp.responseApi.user.login.error = this.handleError(
          err,
          Object.keys(err.response.data).length == 2
        );
      }
    },

    async registerUser(newData) {
      const storeApp = this.getAppStore;
      storeApp.setEntity("user.register");

      try {
        const response = await userService.registerUser(newData);
        if (response) {
          if (response.status === 201) {
            storeApp.responseApi.user.register.message = response.data.message;
            storeApp.responseApi.user.register.error = "";
          }
        } else {
          storeApp.responseApi.user.register.error = "Server response error.";
        }
      } catch (err) {
        storeApp.responseApi.user.register.error = this.handleError(
          err,
          Object.keys(err.response.data).length >= 4
        );
      }
    },

    async resendCodeUser(newData) {
      const storeApp = this.getAppStore;
      storeApp.setEntity("user.register");

      try {
        const response = await userService.resendCodeUser(newData);
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.user.register.message = response.data.detail;
            storeApp.responseApi.user.register.error = "";
          }
        } else {
          storeApp.responseApi.user.register.error = "Server response error.";
        }
      } catch (err) {
        storeApp.responseApi.user.register.error = this.handleError(err);
      }
    },

    async activateCodeUser(newData) {
      const storeApp = this.getAppStore;
      storeApp.setEntity("user.register");

      try {
        const response = await userService.activateCodeUser(newData);
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.user.register.message = response.data.detail;
            storeApp.responseApi.user.register.error = "";
          }
        } else {
          storeApp.responseApi.user.register.error = "Server response error.";
        }
      } catch (err) {
        storeApp.responseApi.user.register.error = this.handleError(
          err,
          Object.keys(err.response.data).length == 2
        );
      }
    },

    async retrieveUser(idUser = this.getIdUser) {
      if (!this.isAuthenticated) {
        this.clearSession();
        return;
      }

      const storeApp = this.getAppStore;
      storeApp.setEntity("user.retrieve");

      try {
        const response = await userService.retrieveUser(idUser, this.getToken);
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.user.retrieve.message = response.data;
            storeApp.responseApi.user.retrieve.error = "";
            this.user = response.data;
          }
        } else {
          storeApp.responseApi.user.retrieve.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await this.refresh(this.getRefreshToken);
            await this.retrieveUser(idUser);
          } catch {
            storeApp.timeout.setCustomTimeout(() => {
              this.clearSession();
            }, 2500);
          }
        } else {
          storeApp.responseApi.user.retrieve.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.user.retrieve.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            this.clearSession();
          }, 2500);
        }
      }
    },

    async updateUser(idUser = this.getIdUser, newData) {
      if (!this.isAuthenticated) {
        this.clearSession();
        return;
      }

      const storeApp = this.getAppStore;
      storeApp.setEntity("user.update");

      try {
        const response = await userService.updateUser(
          idUser,
          newData,
          this.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.user.update.message =
              "Successfully updated user";
            storeApp.responseApi.user.update.error = "";
          }
        } else {
          storeApp.responseApi.user.update.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await this.refresh(this.getRefreshToken);
            await this.updateUser(idUser, newData);
          } catch {
            storeApp.timeout.setCustomTimeout(() => {
              this.clearSession();
            }, 2500);
          }
        } else {
          storeApp.responseApi.user.update.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.user.update.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            this.clearSession();
          }, 2500);
        }
      }
    },

    async deleteUser(idUser = this.getIdUser) {
      if (!this.isAuthenticated) {
        this.clearSession();
        return;
      }

      const storeApp = this.getAppStore;
      storeApp.setEntity("user.delete");

      try {
        const response = await userService.deleteUser(idUser, this.getToken);
        if (response) {
          if (response.status === 204) {
            storeApp.responseApi.user.delete.message =
              "Successfully deleted user.";
            storeApp.responseApi.user.delete.error = "";
          }
        } else {
          storeApp.responseApi.user.delete.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await this.refresh(this.getRefreshToken);
            await this.deleteUser(idUser);
          } catch {
            storeApp.timeout.setCustomTimeout(() => {
              this.clearSession();
            }, 2500);
          }
        } else {
          storeApp.responseApi.user.delete.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.user.delete.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            this.clearSession();
          }, 2500);
        }
      }
    },

    async refresh(refreshToken) {
      if (!this.isAuthenticated) {
        this.clearSession();
        return;
      }

      const storeApp = this.getAppStore;
      storeApp.setEntity("user.token");

      try {
        const response = await userService.refresh(refreshToken);
        if (response) {
          if (response.status === 200) {
            this.token = response.data.access;
            this.refreshToken = response.data.refresh;
          }
        } else {
          storeApp.responseApi.user.token.error = "Server response error.";
        }
      } catch (err) {
        storeApp.responseApi.user.token.error = this.handleError(err);
        storeApp.setModal({
          value: true,
          message: storeApp.responseApi.user.token.error,
        });
        storeApp.timeout.setCustomTimeout(() => {
          this.clearSession();
        }, 2500);
      }
    },

    async logout() {
      if (!this.isAuthenticated) {
        this.clearSession();
        return;
      }

      const storeApp = this.getAppStore;
      storeApp.setEntity("user.logout");

      try {
        const response = await userService.logout(
          this.getToken,
          this.getRefreshToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.user.logout.message = response.data.detail;
            storeApp.responseApi.user.logout.error = "";
          }
        } else {
          storeApp.responseApi.user.logout.error = "Server response error.";
        }
      } catch (err) {
        storeApp.responseApi.user.logout.error = this.handleError(err);
      } finally {
        storeApp.setModal({
          value: true,
          message: storeApp.responseApi.user.logout.error || "Signing out...",
        });
        storeApp.timeout.setCustomTimeout(() => {
          this.clearSession();
        }, 2500);
      }
    },
  },

  persist: [
    {
      pick: ["token", "refreshToken"],
      storage: localStorage,
    },
  ],
});

export default userStore;
