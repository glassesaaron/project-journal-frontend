<template>
  <main>
    <div v-if="projects && projects.length === 0">
      You are currently not assigned to any projects. Please contact a Project
      Manager or Admin to be added to a project.
    </div>
    <div v-if="projects && projects.length > 0">Welcome!</div>
  </main>
</template>

<script>
import userStore from "../models/userStore";

export default {
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
  },

  async created() {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/projects`, {
        credentials: "include",
      });
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
main {
  width: 100%;
  padding: 0rem 2rem;
}
</style>
