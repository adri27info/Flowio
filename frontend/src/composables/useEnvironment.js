export function useEnvironment() {
  return {
    apiBackend: import.meta.env.VITE_BACKEND_URL,
    logo: import.meta.env.VITE_DEFAULT_LOGO_IMAGE_URL,
    profileUser: import.meta.env.VITE_DEFAULT_PROFILE_IMAGE_URL,
    workspaceLogo: import.meta.env.VITE_DEFAULT_WORKSPACE_LOGO_MODAL_IMAGE_URL,
    workspaceBG: import.meta.env.VITE_DEFAULT_WORKSPACE_BG_MODAL_IMAGE_URL,
  };
}
