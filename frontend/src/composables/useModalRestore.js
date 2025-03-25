export function useModalRestore() {
  const restorePageAfterModal = () => {
    if (document.body.classList.contains("modal-open"))
      document.body.classList.remove("modal-open");

    document.querySelectorAll(".modal-backdrop").forEach((el) => {
      if (el.classList.contains("modal-backdrop")) {
        el.remove();
      }
    });
    document.body.style.overflow = "auto";
  };

  return { restorePageAfterModal };
}
