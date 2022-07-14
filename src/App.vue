<script setup lang="ts">
import { RouterView } from "vue-router";
import HeaderBar from "./components/HeaderBar.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <HeaderBar msg="Project Journal" />
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
