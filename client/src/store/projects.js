import axios from "axios";

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
    deleteProject({state, commit, rootState}, payload) {
      return new Promise(function(resolve, reject) {
        axios.delete("/api/projects/" + payload.userId + "/" + payload.projectId).then(res => {
          resolve();
        })
      })
    },
    getProjects({state, commit, rootState}, payload) {
      return new Promise(function(resolve, reject) {
        axios.get("/api/projects/" + rootState.user.id).then(res => {
          commit("GET_PROJECTS", res.data);
          resolve();
        });
      })
    }
  }
};
