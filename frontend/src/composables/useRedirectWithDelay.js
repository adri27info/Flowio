import { ref } from "vue";
import { useRouter } from "vue-router";
import appStore from "@/stores/general/appStore";

export function useRedirectWithDelay() {
  const router = useRouter();
  const storeApp = appStore();
  const isRedirecting = ref(false);

  const redirectWithDelay = ({
    routeName,
    delay = 2000,
    closeModal = false,
    action = "",
    workspaceId = null,
    boardId = null,
  }) => {
    setTimeout(() => {
      if (closeModal) {
        storeApp.setModal({ value: false, action: action });
      }

      const routeParams = {
        name: routeName,
        params: {
          ...(workspaceId && { workspaceId }),
          ...(boardId && { boardId }),
        },
      };

      router.push(routeParams);
    }, delay);
  };

  return {
    redirectWithDelay,
    isRedirecting,
  };
}
