import axios from "axios";
var initialState = {
  projects: []
};

export default {
  state: {
    projects: []
  },
  mutations: {
    GET_PROJECTS: (state, projects) => {
      state.projects = projects;
    },
    resetState: state => {
      state = initialState;
    }
  },
  getters: {},
  actions: {
    deleteProject({ dispatch, commit, rootState }, payload) {
      return new Promise(function(resolve, reject) {
        axios
          .delete("/api/projects/" + payload.userId + "/" + payload.projectId)
          .then(res => {
            dispatch("getProjects").then(res2 => {
              resolve();
            });
          });
      });
    },
    getProjects({ state, commit, rootState }) {
      return new Promise(function(resolve, reject) {
        axios.get("/api/projects/" + rootState.user.id).then(res => {
          commit("GET_PROJECTS", res.data);
          resolve();
        });
      });
    }
  }
};
