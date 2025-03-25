import { createPinia } from "pinia";
import { createApp } from "vue";
import { OhVueIcon, addIcons } from "oh-vue-icons";
import {
  MdLoginRound,
  HiNewspaper,
  MdLockreset,
  BiPersonWorkspace,
  HiTemplate,
  FaUsers,
  HiSearch,
  IoCloseOutline,
  BiArrowUpCircleFill,
  BiArrowLeftShort,
  BiArrowRightShort,
  MdSpacedashboard,
  LaUserEditSolid,
  RiDeleteBin2Line,
  HiPlusSm,
  LaEllipsisHSolid,
  FaInfoCircle,
  LaAngleDownSolid,
  BiCardChecklist,
  MdFormatlistbulleted,
} from "oh-vue-icons/icons";

import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/assets/styles/main.css";
import router from "@/router";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import App from "@/App.vue";

addIcons(
  MdLoginRound,
  HiNewspaper,
  MdLockreset,
  BiPersonWorkspace,
  HiTemplate,
  FaUsers,
  HiSearch,
  IoCloseOutline,
  BiArrowUpCircleFill,
  BiArrowLeftShort,
  BiArrowRightShort,
  MdSpacedashboard,
  LaUserEditSolid,
  RiDeleteBin2Line,
  HiPlusSm,
  LaEllipsisHSolid,
  FaInfoCircle,
  LaAngleDownSolid,
  BiCardChecklist,
  MdFormatlistbulleted
);

const pinia = createPinia();
const app = createApp(App);
pinia.use(piniaPluginPersistedstate);
app.component("v-icon", OhVueIcon);
app.use(router);
app.use(pinia);
app.mount("#app");
