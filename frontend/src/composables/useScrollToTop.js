export function useScrollToTop() {
  const scrollToTop = () => {
    const element = document.querySelector("#flowio");
    if (element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  };

  return { scrollToTop };
}
