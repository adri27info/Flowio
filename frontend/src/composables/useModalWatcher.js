import { watch, nextTick } from "vue";
import * as bootstrap from "bootstrap";
import appStore from "@/stores/general/appStore";
import formStore from "@/stores/general/formStore";
import workspaceStore from "@/stores/workspace/workspaceStore";

export function useModalWatcher() {
  const storeApp = appStore();
  const storeForm = formStore();
  const storeWorkspace = workspaceStore();
  const modalRestore = storeApp.modalRestore;
  const modalFormsToReset = [
    "editUser",
    "editWorkspace",
    "createWorkspace",
    "editBoard",
    "createBoard",
    "createList",
    "createCard",
    "editCard",
  ];

  const resetAndCloseModal = ({
    action,
    modalId,
    ref = null,
    entity = "",
    resetEntityApi = true,
  }) => {
    watch(
      [() => storeApp.getModal, () => storeApp.getActionModal],
      async ([newModalState, newActionModal]) => {
        const haveToReset = modalFormsToReset.includes(action);
        let modalElement = null;
        let modalInstance = null;

        if (newModalState && newActionModal === action) {
          await nextTick();
          modalElement = document.querySelector(`#${modalId}`);

          if (modalElement) {
            modalInstance = new bootstrap.Modal(modalElement);
            storeApp.setModalObj(modalInstance);
            modalInstance.show();

            const actions = {
              listMessageModal: () => {
                setTimeout(() => {
                  closeModalAndRestore(modalInstance, action);
                }, 2000);
              },
              default: () => {
                checkBtn(action);
                modalElement.addEventListener("hidden.bs.modal", () => {
                  setActiveComponentWorkspace(action);
                  handleModalCloseRestore(
                    action,
                    modalInstance,
                    ref,
                    entity,
                    haveToReset,
                    resetEntityApi
                  );
                });
              },
            };

            modalId == "listMessageModal"
              ? actions.listMessageModal()
              : actions.default();
          } else {
            checkBtn(action);
            if (newActionModal == action) {
              if (haveToReset) storeForm.setFormToReset(action);
              dynamicResetAndClear(action, ref, entity, resetEntityApi, null);
            }
          }
        }
      }
    );
  };

  const closeModalAndRestore = (modalInstance, action) => {
    modalInstance.hide();
    modalRestore.restorePageAfterModal();
    storeApp.setModal({ value: false, action });
  };

  const handleModalCloseRestore = (
    action,
    modalInstance,
    ref,
    entity,
    haveToReset,
    resetEntityApi
  ) => {
    if (haveToReset) storeForm.setFormToReset(action);
    modalInstance.hide();
    dynamicResetAndClear(action, ref, entity, resetEntityApi, null);
    storeApp.setModal({ value: false, action });
  };

  const dynamicResetAndClear = (
    action,
    ref,
    entity,
    resetEntityApi,
    resetStructureListValues
  ) => {
    checkBtn(action);
    if (storeForm.getFormToReset === action) delayClearForm(action, ref);

    if (resetEntityApi) storeApp.setResponseApi(entity);

    if (typeof resetStructureListValues === "function") {
      resetStructureListValues();
    }

    modalRestore.restorePageAfterModal();
  };

  const delayClearForm = (action, ref) => {
    if (storeForm.getFormToReset === action) {
      storeApp.timeout.setCustomTimeout(() => {
        storeForm.clearForm(action, ref);
      }, 500);
    }
  };

  const setActiveComponentWorkspace = (action) => {
    if (action == "editWorkspace" || action == "deleteWorkspace")
      storeWorkspace.setActiveComponent("boards");
  };

  const checkBtn = (action) => {
    let btnName = "btn" + action.charAt(0).toUpperCase() + action.slice(1);
    const btn = document.querySelector(`button.${btnName}`);
    if (btn) btn.classList.remove("disabled");
  };

  return {
    resetAndCloseModal,
    dynamicResetAndClear,
    delayClearForm,
  };
}
