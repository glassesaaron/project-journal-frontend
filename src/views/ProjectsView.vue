<template>
  <div id="projects">
    <h2>Projects</h2>
    <div v-if="error !== null">Error: {{ error }}</div>
    <div v-if="projects === null && error === null">
      <img src="@/assets/loading.gif" />
    </div>
    <table id="projects-table">
      <tr v-for="project in projects" v-bind:key="project.id">
        <td class="col-name">
          <router-link :to="{ path: `/projects/${project.id}/entries` }">{{
            project.name
          }}</router-link>
        </td>
      </tr>
    </table>
    <div id="add-user" v-if="role === 'ADMIN' || role === 'PROJECT_MANAGER'">
      <button @click="addProject()">Add Project</button>
    </div>
  </div>
</template>

<script>
import userStore from "../models/userStore";

export default {
  data() {
    return {
      projects: null,
      error: null,
    };
  },

  computed: {
    role() {
      return userStore.getRole();
    },
  },

  methods: {
    async getProjects() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/projects`,
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
    addProject() {
      this.$router.push("/projects/add");
    },
  },

  created() {
    this.getProjects();
  },
};
</script>

<style scoped>
#projects {
  width: 100%;
  padding: 0rem 2rem;
}

#projects-table {
  border-spacing: 0px;
  width: 100%;
  margin: 0px 0px 2rem 0px;
}

#projects-table td {
  border-bottom: 1px solid var(--black);
  padding: 1rem 0px 1rem 0px;
  margin-bottom: 200px;
}

#projects-table td a {
  color: var(--white);
  text-decoration: none;
}

.col-name {
  width: 100%;
}
</style>
