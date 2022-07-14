<template>
  <main>
    <h2>Add Entry</h2>
    <textarea v-model="entryContent"></textarea>
    <br />
    <button @click="submitJournalEntry()">Save</button>
  </main>
</template>

<script>
import userStore from "../models/userStore";

export default {
  data() {
    return {
      entryContent: "",
    };
  },

  methods: {
    async submitJournalEntry() {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/projects/${
            this.$route.params.projectId
          }/entries`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId: userStore.getId(),
              content: this.entryContent,
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

        this.$router.push(`/projects/${this.$route.params.projectId}/entries`);
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

textarea {
  width: 40rem;
  height: 20rem;
}
</style>
