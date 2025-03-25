export function useTimeout() {
  const setCustomTimeout = (callback, delay) => {
    const timeout = setTimeout(callback, delay);
    return timeout;
  };

  return {
    setCustomTimeout,
  };
}
