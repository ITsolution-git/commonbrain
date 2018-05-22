import axios from "axios";

export default {
  state: {
    files: [],
    file: {}
  },
  mutations: {
    GET_FILES: (state, files) => {
      state.files = files;
    },
    GET_FILE: (state, file) => {
      state.file = file;
    }
  },
  getters: {},
  actions: {
    getFiles({state, commit, rootState}, payload) {
      return new Promise(function(resolve, reject) {
        axios.get("/api/files/" + payload.userId + "/" + payload.projectId).then(res => {
          //console.log(res.data);
          commit("GET_FILES", res.data);
          resolve();
        });
      })
    },
    getFile({state, commit, rootState}, payload) {
      return new Promise(function(resolve, reject) {
        axios.get("/api/files/" + payload.userId + "/" + payload.projectId + "/" + payload.fileId).then(res => {
          //console.log(res.data);
          commit("GET_FILE", res.data);
          resolve();
        });
      })
    }
  }
};
