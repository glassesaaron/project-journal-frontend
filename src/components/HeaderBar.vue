<template>
  <div id="header">
    <img id="header-icon" src="@/assets/logo.png" />
    <RouterLink to="/" :disabled="!loggedIn">
      <div id="title">{{ msg }}</div>
    </RouterLink>
    <nav>
      <RouterLink
        :to="addEntryUrl"
        v-if="loggedIn && projects && projects.length === 1"
        >Add Entry</RouterLink
      >
      <RouterLink
        to="/projects"
        v-if="loggedIn && projects && projects.length > 1"
        >Projects</RouterLink
      >
      <RouterLink
        :to="entriesUrl"
        v-if="loggedIn && projects && projects.length === 1"
        >Entries</RouterLink
      >
      <RouterLink to="/users" v-if="loggedIn && isAdmin">Users</RouterLink>
      <RouterLink to="/login">{{ loggedIn ? "Log Out" : "Log In" }}</RouterLink>
    </nav>
  </div>
</template>

<script>
import userStore from "../models/userStore";

export default {
  props: {
    msg: String,
  },

  data() {
    return {
      projects: null,
    };
  },

  computed: {
    loggedIn() {
      return userStore.loggedIn();
    },
    isAdmin() {
      return userStore.isAdmin();
    },
    addEntryUrl() {
      if (!this.projects || this.projects.length == 0) {
        return "/";
      }
      return `/projects/${this.projects[0].id}/entries/add`;
    },
    entriesUrl() {
      if (!this.projects || this.projects.length == 0) {
        return "/";
      }
      return `/projects/${this.projects[0].id}/entries`;
    },
  },

  async created() {
    // todo: pass project list to all child components
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
        credentials: "include",
      });
      // todo: global api error handling
      if (response.status === 401) {
        this.$router.push("/login");
        return;
      }
      if (response.status !== 200) {
        alert(`Error: ${response.status}`);
        return;
      }
      const data = await response.json();
      if (!response.ok) {
        const error = (data && data.message) || response.statusText;
        return Promise.reject(error);
      }

      data.map((x) => (x.updatedAt = new Date(x.updatedAt)));
      data.sort((a, b) => {
        return b.updateAt - a.updateAt;
      });

      this.projects = data;
    } catch (error) {
      this.error = error;
      console.error(error);
      return Promise.reject(error);
    }
  },
};
</script>

<style scoped>
#header {
  width: 100%;
  height: 4rem;
  background-color: var(--theme-dark2);
  color: var(--white);
  margin: 0px 0px 1.5rem 0px;
}

#header-icon {
  width: 2.5rem;
  float: left;
  margin: 0.7rem 1rem 0.5rem 0.5rem;
}

#title {
  float: left;
  margin: 0.8rem 0px 0px 0px;
  font-size: 1.5rem;
  text-decoration: none;
  color: var(--white);
}

nav {
  float: right;
  margin: 1.2rem 2rem 0px 0px;
}

nav a {
  text-decoration: none;
  color: var(--white);
  margin: 0rem 1rem 0rem 0rem;
}
</style>
