import axios from "axios";
import store from "./index";
export default {
  state: {
    projects: []
  },
  mutations: {
    GET_PROJECTS: (state, projects) => {
      state.projects = projects;
    }
  },
  getters: {},
  actions: {
    getProjects: (context, payload) => {
      axios.get("/projects/" + store.state.user.id).then(res => {
        context.commit("GET_PROJECTS", res.data.items);
      });
    }
  }
};
