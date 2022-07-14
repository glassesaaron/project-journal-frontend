<template>
  <div id="users">
    <h2>Users</h2>
    <br />
    <div v-if="error !== null">Error: {{ error }}</div>
    <div v-if="(projectUsers === null || allUsers === null) && error === null">
      <img src="@/assets/loading.gif" />
    </div>
    <div v-for="user in projectUsers" v-bind:key="user.id">
      <p>{{ user.email }}</p>
    </div>
    <br />
    <h2>Add User</h2>
    <br />
    <select v-model="selectedUser">
      <option
        v-for="user in allUsers"
        v-bind:key="user.id"
        v-bind:value="user.id"
      >
        {{ user.email }}
      </option>
    </select>
    <button
      id="add-user"
      @click="addUser()"
      :disabled="!allUsers || allUsers.length === 0"
    >
      Add User
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selectedUser: null,
      projectUsers: null,
      projectUserIds: new Set(),
      allUsers: null,
      error: null,
    };
  },

  methods: {
    async getProjectUsers() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/projects/${
            this.$route.params.projectId
          }/users`,
          {
            credentials: "include",
          }
        );
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

        this.projectUsers = data;
        for (const x of this.projectUsers) {
          this.projectUserIds.add(x.id);
        }
      } catch (error) {
        this.error = error;
        console.error(error);
        return Promise.reject(error);
      }
    },
    async getAllUsers() {
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

        this.allUsers = data.filter(
          (x) => !this.projectUserIds.has(x.id) && x.role !== "ADMIN"
        );
      } catch (error) {
        this.error = error;
        console.error(error);
        return Promise.reject(error);
      }
    },
    async addUser() {
      if (this.selectedUser === null) {
        return;
      }
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/projects/${
            this.$route.params.projectId
          }/users`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: this.selectedUser,
            }),
          }
        );
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

        this.$router.go();
      } catch (error) {
        this.error = error;
        console.error(error);
        return Promise.reject(error);
      }
    },
  },

  async created() {
    await this.getProjectUsers();
    await this.getAllUsers();
  },
};
</script>

<style scoped>
#users {
  width: 100%;
  padding: 0rem 2rem;
}

select {
  width: 20rem;
  float: left;
}

#add-user {
  float: left;
  margin-left: 1rem;
}

button:disabled {
  background: var(--theme-light4);
  color: var(--black);
  cursor: not-allowed;
}
</style>
