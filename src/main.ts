import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
// todo: don't do this
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import GAuth from "vue3-google-oauth2";

import "./assets/main.css";

const app = createApp(App);

const gAuthOptions = {
  clientId: import.meta.env.VITE_CLIENT_ID,
  scope: "email",
  prompt: "consent",
  fetch_basic_profile: false,
};
app.use(GAuth, gAuthOptions);

app.use(router);

app.mount("#app");
