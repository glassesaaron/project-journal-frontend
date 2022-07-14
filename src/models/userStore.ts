import { reactive } from "vue";

type User = {
  data: any;
};

let user: User;
user = {
  data: null,
};

if (localStorage.getItem("user") === null) {
  localStorage.setItem("user", JSON.stringify(user));
}
const storageUser = localStorage.getItem("user");
user = JSON.parse(storageUser == null ? "" : storageUser);

const reactiveUser = reactive(user);

const store = {
  getUser() {
    return reactiveUser;
  },
  loggedIn() {
    return reactiveUser.data !== null && reactiveUser.data.dbUser.id !== null;
  },
  getRole() {
    if (!reactiveUser.data) {
      return "";
    }
    return reactiveUser.data.dbUser.role;
  },
  getId() {
    if (!reactiveUser.data) {
      return -1;
    }
    return reactiveUser.data.dbUser.id;
  },
  isAdmin() {
    return this.getRole() === "ADMIN";
  },
  setData(data: any) {
    reactiveUser.data = data;
    user.data = data;
    localStorage.setItem("user", JSON.stringify(user));
  },
  clearData() {
    reactiveUser.data = null;
    user.data = null;
    localStorage.setItem("user", JSON.stringify(user));
  },
};

export default store;
