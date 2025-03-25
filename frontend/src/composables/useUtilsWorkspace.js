export function useUtilsWorkspace() {
  const getFirstLetter = (name) => {
    return name.charAt(0).toUpperCase();
  };

  const getStyles = (workspace) => {
    return {
      background: workspace.background_workspace?.gradient_theme,
    };
  };

  const getTruncatedName = (name, length = 15) => {
    const formattedName = getFirstLetter(name) + name.slice(1);
    return formattedName.length > length
      ? formattedName.slice(0, length) + "..."
      : formattedName;
  };

  return {
    getFirstLetter,
    getStyles,
    getTruncatedName,
  };
}
