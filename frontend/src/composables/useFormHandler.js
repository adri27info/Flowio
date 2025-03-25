import appStore from "@/stores/general/appStore";
import formStore from "@/stores/general/formStore";

export function useFormHandler(withLoading) {
  const storeApp = appStore();
  const storeForm = formStore();

  const handleFormSubmit = async (formConfig, emit) => {
    const {
      btnName,
      keyForm,
      fields,
      action,
      entity,
      errorMessages,
      optionsRedirection = null,
      emitEvent = { nameEvent: "", data: "" },
      extraActions = null,
    } = formConfig;

    const showErrorForm = document.querySelector("p.showErrorForm");
    const btnSubmit = document.querySelector(`button.${btnName}`);

    if (storeForm.canSubmitForm(keyForm, fields)) {
      await withLoading(async () => {
        storeForm.formErrors[keyForm].form = "";
        await action();

        const message = entity
          .split(".")
          .reduce((obj, key) => obj?.[key], storeApp.responseApi)?.message;

        if (message) {
          btnSubmit?.classList.add("disabled");

          if (extraActions) {
            const actions = Array.isArray(extraActions)
              ? extraActions
              : [extraActions];

            await Promise.all(actions.map((action) => action()));
          }

          if (emitEvent.nameEvent) {
            emit(
              emitEvent.nameEvent,
              typeof emitEvent.data === "function"
                ? emitEvent.data()
                : emitEvent.data || null
            );
          }

          if (optionsRedirection)
            storeApp.redirect.redirectWithDelay(optionsRedirection);
        }
      });
    } else {
      if (showErrorForm) {
        storeForm.formErrors[keyForm].form = errorMessages();
      }
      storeForm.validateAllFields(keyForm);
    }
  };

  return {
    handleFormSubmit,
  };
}
