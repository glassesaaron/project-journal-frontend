<template>
  <div id="users">
    <h2>Users</h2>
    <div v-if="error !== null">Error: {{ error }}</div>
    <div v-if="users === null && error === null">
      <img src="@/assets/loading.gif" />
    </div>
    <div v-for="user in users" v-bind:key="user.id">
      <p>{{ user.id }}: {{ user.email }}</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: null,
      error: null,
    };
  },

  methods: {
    async getUsers() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/users`, {
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

        this.users = data;
      } catch (error) {
        this.error = error;
        console.error(error);
        return Promise.reject(error);
      }
    },
  },

  created() {
    this.getUsers();
  },
};
</script>

<style scoped>
#users {
  width: 100%;
  padding: 0rem 2rem;
}
</style>
