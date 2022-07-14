<template>
  <div id="entries">
    <h2 id="page-title">Entries</h2>
    <button id="add-entry" @click="addEntry()">Add Entry</button>
    <button
      id="manage-users"
      @click="manageUsers()"
      v-if="role === 'ADMIN' || role === 'PROJECT_MANAGER'"
    >
      Manage Users
    </button>
    <div v-if="error !== null">Error: {{ error }}</div>
    <div v-if="project?.entries === null && error === null">
      <img src="@/assets/loading.gif" />
    </div>
    <table id="entries-table">
      <tr v-for="entry in project?.entries" v-bind:key="entry.id">
        <td class="col-date">
          {{ entry.createdAt.toLocaleDateString("en-US") }}
        </td>
        <td class="col-content">{{ entry.content }}</td>
      </tr>
      <tr v-if="project?.entries.length === 0">
        <td>No entries for this project.</td>
      </tr>
    </table>
  </div>
</template>

<script>
import userStore from "../models/userStore";

export default {
  data() {
    return {
      project: null,
      error: null,
    };
  },

  computed: {
    role() {
      return userStore.getRole();
    },
  },

  methods: {
    async getProject() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/projects/${
            this.$route.params.projectId
          }`,
          { credentials: "include" }
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

        data.entries.map((x) => (x.createdAt = new Date(x.createdAt)));
        data.entries.sort((a, b) => {
          return b.createdAt - a.createdAt;
        });

        this.project = data;
      } catch (error) {
        this.error = error;
        console.error(error);
        return Promise.reject(error);
      }
    },
    addEntry() {
      this.$router.push(
        `/projects/${this.$route.params.projectId}/entries/add`
      );
    },
    manageUsers() {
      this.$router.push(`/projects/${this.$route.params.projectId}/users`);
    },
  },

  created() {
    this.getProject();
  },
};
</script>

<style scoped>
#page-title {
  width: 10rem;
  float: left;
}

#entries {
  width: 100%;
  padding: 0rem 2rem;
}

#entries-table {
  border-spacing: 0px;
  width: 100%;
}

#entries-table td {
  border-bottom: 1px solid var(--black);
  padding: 1rem 0px 1rem 0px;
  margin-bottom: 200px;
}

#add-entry {
  float: right;
  width: 10rem;
  height: 2rem;
  padding-top: 0.4rem;
}

#manage-users {
  float: right;
  width: 12rem;
  height: 2rem;
  padding-top: 0.4rem;
  margin-right: 1rem;
}

.col-date {
  width: 20%;
}

.col-content {
  width: 80%;
}
</style>
