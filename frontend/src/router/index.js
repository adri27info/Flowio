import { createRouter, createWebHistory } from "vue-router";

import userStore from "@/stores/user/userStore";
import LoginView from "@/views/auth/LoginView.vue";
import RegisterView from "@/views/auth/RegisterView.vue";
import WorkspaceView from "@/views/workspace/WorkspaceView.vue";
import StructureView from "@/views/structure/StructureView.vue";
import NotFoundView from "@/views/general/NotFoundView.vue";
import ProfileView from "@/views/user/ProfileView.vue";
import WorkspaceDetailView from "@/views/workspace/WorkspaceDetailView.vue";
import BoardDetailView from "@/views/boards/BoardDetailView.vue";

let previousRoute = null;
const routes = [
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: NotFoundView,
  },
  {
    path: "/",
    name: "login",
    component: LoginView,
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: {
      requireAuth: false,
    },
  },
  {
    path: "/workspaces",
    name: "workspaces",
    component: WorkspaceView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/workspace/:workspaceId",
    name: "workspace-detail",
    component: WorkspaceDetailView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/workspace/:workspaceId/board/:boardId",
    name: "board-detail",
    component: BoardDetailView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/structures",
    name: "structures",
    component: StructureView,
    meta: {
      requireAuth: true,
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    meta: {
      requireAuth: true,
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  previousRoute = from;
  const storeUser = userStore();
  const isAuth = storeUser.getToken;

  if ((to.name === "login" || to.name === "register") && isAuth) {
    next({ name: "workspaces" });
  } else if (to.meta.requireAuth && !isAuth) {
    next({ name: "login" });
  } else {
    next();
  }
});

export function getPreviousRoute() {
  return previousRoute;
}

export default router;
