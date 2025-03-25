import { defineStore } from "pinia";
import boardService from "@/services/board/boardService";
import listService from "@/services/board/list/listService";
import cardService from "@/services/board/card/cardService";
import traceService from "@/services/board/trace/traceService";
import useHandleErrorApi from "@/composables/useHandleErrorApi";
import userStore from "@/stores/user/userStore";
import appStore from "@/stores/general/appStore";

const boardStore = defineStore("boardStore", {
  state: () => ({
    boardId: 0,
    listId: 0,
    listTitle: "",
    cardId: 0,
    handleError: useHandleErrorApi().handleError,
  }),

  getters: {
    getBoardId(state) {
      return state.boardId;
    },
    getListId(state) {
      return state.listId;
    },
    getListTitle(state) {
      return state.listTitle;
    },
    getCardId(state) {
      return state.cardId;
    },
    getUserStore() {
      return userStore();
    },
    getAppStore() {
      return appStore();
    },
  },

  actions: {
    setBoardId(value) {
      this.boardId = value;
    },

    setListId(value) {
      this.listId = value;
    },

    setCardId(value) {
      this.cardId = value;
    },

    setListTitle(value) {
      this.listTitle = value;
    },

    async createBoard(newData) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("board.create");

      try {
        const response = await boardService.createBoard(
          storeUser.getToken,
          newData
        );
        if (response) {
          if (response.status === 201) {
            storeApp.responseApi.board.create.message =
              "Board created successfully";
            storeApp.responseApi.board.create.error = "";
          }
        } else {
          storeApp.responseApi.board.create.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.createBoard(newData);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.board.create.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.board.create.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async retrieveBoard(idBoard) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("board.retrieve");

      try {
        const response = await boardService.retrieveBoard(
          idBoard,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.board.retrieve.message = response.data;
            storeApp.responseApi.board.retrieve.error = "";
            this.setBoardId(idBoard);
          }
        } else {
          storeApp.responseApi.board.retrieve.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.retrieveBoard(idBoard);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.board.retrieve.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.board.retrieve.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async updateBoard(idBoard, newData) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("board.update");

      try {
        const response = await boardService.updateBoard(
          idBoard,
          newData,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.board.update.message =
              "Successfully updated board";
            storeApp.responseApi.board.update.error = "";
          }
        } else {
          storeApp.responseApi.board.update.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.updateBoard(idBoard, newData);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.board.update.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.board.update.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async deleteBoard(idBoard) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("board.delete");

      try {
        const response = await boardService.deleteBoard(
          idBoard,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 204) {
            storeApp.responseApi.board.delete.message =
              "Successfully deleted board";
            storeApp.responseApi.board.delete.error = "";
          }
        } else {
          storeApp.responseApi.board.delete.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.deleteBoard(idBoard);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.board.delete.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.board.delete.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async createList(newData) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("list.create");

      try {
        const response = await listService.createList(
          storeUser.getToken,
          newData
        );
        if (response) {
          if (response.status === 201) {
            storeApp.responseApi.list.create.message =
              "List created successfully";
            storeApp.responseApi.list.create.error = "";
          }
        } else {
          storeApp.responseApi.list.create.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.createList(newData);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.list.create.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.list.create.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async updateList(idList, newData) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("list.update");

      try {
        const response = await listService.updateList(
          idList,
          newData,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.list.update.message =
              "Successfully updated list";
            storeApp.responseApi.list.update.error = "";
          }
        } else {
          storeApp.responseApi.list.update.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.updateList(idList, newData);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.list.update.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.list.update.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async deleteList(idList) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("list.delete");

      try {
        const response = await listService.deleteList(
          idList,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 204) {
            storeApp.responseApi.list.delete.message =
              "Successfully deleted list";
            storeApp.responseApi.list.delete.error = "";
          }
        } else {
          storeApp.responseApi.list.delete.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.deleteList(idList);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.list.delete.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.list.delete.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async createCard(newData) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("card.create");

      try {
        const response = await cardService.createCard(
          storeUser.getToken,
          newData
        );
        if (response) {
          if (response.status === 201) {
            storeApp.responseApi.card.create.message =
              "Card created successfully";
            storeApp.responseApi.card.create.error = "";
            this.setCardId(response.data.id);
          }
        } else {
          storeApp.responseApi.card.create.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.createCard(newData);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.card.create.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.card.create.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async retrieveCard(idCard) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("card.retrieve");

      try {
        const response = await cardService.retrieveCard(
          idCard,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.card.retrieve.message = response.data;
            storeApp.responseApi.card.retrieve.error = "";
          }
        } else {
          storeApp.responseApi.card.retrieve.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.retrieveCard(idCard);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.card.retrieve.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.card.retrieve.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async updateCard(idCard, newData) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("card.update");

      try {
        const response = await cardService.updateCard(
          idCard,
          newData,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.card.update.message =
              "Successfully updated card";
            storeApp.responseApi.card.update.error = "";
          }
        } else {
          storeApp.responseApi.card.update.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.updateCard(idCard, newData);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.list.card.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.list.card.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async partialUpdateCard(idCard, newData) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("card.partial");

      try {
        const response = await cardService.partialUpdateCard(
          idCard,
          newData,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.card.partial.message = response.data;
            storeApp.responseApi.card.partial.error = "";
          }
        } else {
          storeApp.responseApi.card.partial.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.partialUpdateCard(idCard, newData);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.card.partial.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.card.partial.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async batchCard(updates) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("card.batch");

      try {
        const response = await cardService.batchCard(
          updates,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 200) {
            storeApp.responseApi.card.batch.message = response.data;
            storeApp.responseApi.card.batch.error = "";
          }
        } else {
          storeApp.responseApi.card.batch.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.batchCard(updates);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.card.batch.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.card.batch.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async deleteCard(idCard) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("card.delete");

      try {
        const response = await cardService.deleteCard(
          idCard,
          storeUser.getToken
        );
        if (response) {
          if (response.status === 204) {
            storeApp.responseApi.card.delete.message =
              "Successfully deleted card";
            storeApp.responseApi.card.delete.error = "";
          }
        } else {
          storeApp.responseApi.card.delete.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.deleteCard(idCard);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.card.delete.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.card.delete.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },

    async createTrace(newData) {
      const storeApp = this.getAppStore;
      const storeUser = this.getUserStore;

      if (!storeUser.isAuthenticated) {
        storeUser.clearSession();
        return;
      }

      storeApp.setEntity("trace.create");

      try {
        const response = await traceService.createTrace(
          storeUser.getToken,
          newData
        );
        if (response) {
          if (response.status === 201) {
            storeApp.responseApi.trace.create.message =
              "Trace created successfully";
            storeApp.responseApi.trace.create.error = "";
          }
        } else {
          storeApp.responseApi.trace.create.error = "Server response error.";
        }
      } catch (err) {
        if (err.response?.data?.code === "token_not_valid") {
          try {
            await storeUser.refresh(storeUser.getRefreshToken);
            await this.createTrace(newData);
          } catch {
            storeUser.clearSession();
          }
        } else {
          storeApp.responseApi.trace.create.error = this.handleError(err);
          storeApp.setModal({
            value: true,
            message: storeApp.responseApi.trace.create.error,
          });
          storeApp.timeout.setCustomTimeout(() => {
            storeUser.clearSession();
          }, 2500);
        }
      }
    },
  },
});

export default boardStore;
