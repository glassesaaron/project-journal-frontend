<template>
  <main>
    <h2>Add Project</h2>
    <br />
    <h3>Project Name</h3>
    <input type="text" v-model="name" />
    <br /><br />
    <h3>Project Description</h3>
    <input type="text" v-model="description" />
    <br />
    <br />
    <button @click="submitProject()">Save</button>
  </main>
</template>

<script>
export default {
  data() {
    return {
      name: "",
      description: "",
    };
  },

  methods: {
    async submitProject() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/projects`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: this.name,
              description: this.description,
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

        this.$router.push(`/projects/${data.id}/entries`);
      } catch (error) {
        this.error = error;
        console.error(error);
        return Promise.reject(error);
      }
    },
  },
};
</script>

<style scoped>
main {
  width: 100%;
  padding: 0rem 2rem;
}

input {
  width: 40rem;
}

select {
  width: 40rem;
}
</style>
