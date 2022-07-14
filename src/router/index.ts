import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import userStore from "../models/userStore";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "login",
      component: () => import("../views/AuthView.vue"),
    },
    {
      path: "/users",
      name: "users",
      component: () => import("../views/UsersView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/projects",
      name: "projects",
      component: () => import("../views/ProjectsView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/projects/add",
      name: "addProject",
      component: () => import("../views/AddProjectView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/projects/:projectId/entries",
      name: "entries",
      component: () => import("../views/EntriesView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/projects/:projectId/entries/add",
      name: "addEntry",
      component: () => import("../views/AddEntryView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/projects/:projectId/users",
      name: "projectUsers",
      component: () => import("../views/ProjectUsersView.vue"),
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (userStore.loggedIn()) {
      next();
      return;
    }
    next("/login");
    next();
  } else {
    next();
  }
});

export default router;
