<template>
  <div id="button-container">
    <!-- <h1>User State Id: {{ userStore.getUser().data?.emails[0].value }}</h1>
    <h1>IsInit: {{ Vue3GoogleOauth.isInit }}</h1>
    <h1>IsAuthorized: {{ Vue3GoogleOauth.isAuthorized }}</h1>
    <h2 v-if="user">signed user: {{ user }}</h2> -->
    <button
      @click="handleClickGetAuthCode"
      :disabled="!Vue3GoogleOauth.isInit"
      v-if="!loggedIn"
    >
      Sign In Via Google
    </button>
    <button @click="handleClickSignOut" v-if="loggedIn">Sign Out</button>
  </div>
</template>

<script>
import { inject, toRefs } from "vue";
import userStore from "../models/userStore";

export default {
  // todo: clean up this entire page

  props: {
    msg: String,
  },

  data() {
    return {
      user: "",
    };
  },

  computed: {
    loggedIn() {
      return userStore.loggedIn();
    },
  },

  methods: {
    async handleClickSignIn() {
      try {
        const googleUser = await this.$gAuth.signIn();
        if (!googleUser) {
          return null;
        }
        console.log("googleUser", googleUser);
        this.user = googleUser.getBasicProfile().getEmail();
        console.log("getId", this.user);
        console.log("user id: " + userStore.getUser().id);
        console.log("getBasicProfile", googleUser.getBasicProfile());
        console.log("getAuthResponse", googleUser.getAuthResponse());
        console.log(
          "getAuthResponse",
          this.$gAuth.instance.currentUser.get().getAuthResponse()
        );
      } catch (error) {
        //on fail do something
        console.error(error);
        return null;
      }
    },

    async handleClickGetAuthCode() {
      try {
        const authCode = await this.$gAuth.getAuthCode();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            code: authCode,
          }),
        });
        const data = await response.json();
        userStore.setData(data);
        window.location.href = "/";
      } catch (error) {
        //on fail do something
        console.error(error);
        return null;
      }
    },

    async handleClickSignOut() {
      try {
        await this.$gAuth.signOut();
        const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
          method: "POST",
        });
        if (response.status !== 200) {
          alert(`Error: ${response.status}`);
          return;
        }
        userStore.clearData();
        this.user = "";
      } catch (error) {
        console.error(error);
      }
    },

    handleClickDisconnect() {
      window.location.href = `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${window.location.href}`;
    },
  },
  setup(props) {
    const { isSignIn } = toRefs(props);
    const Vue3GoogleOauth = inject("Vue3GoogleOauth");

    return {
      Vue3GoogleOauth,
      isSignIn,
      userStore,
    };
  },
};
</script>

<style>
#button-container {
  text-align: center;
  padding: 2rem 0px 0px 0px;
}

button:disabled {
  background: var(--theme-light4);
  color: var(--black);
  cursor: not-allowed;
}
</style>
