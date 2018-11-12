import Vue from "vue";
import Vuex from "vuex";
import jwt_decode from "jwt-decode";
import projectStore from "./projects";
import fileStore from "./files";
// import createPersistedState from "vuex-persistedstate";
import ApiWrapper from '@/shared/utils/ApiWrapper';
Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {
    projectStore,
    fileStore
  },
  // plugins: [createPersistedState()],
  state: {
    user: {},
    globalLoader: true
  },
  getters: {
    user: (state)=>state.user,
    globalLoader: (state)=>state.globalLoader,
  },
  mutations: {
    SET_USER(state, payload) {
      var user = payload;
      this.state.user = user;
      return this.state;
    },
    SET_GLOBAL_LOADER(state, payload) {
      this.state.globalLoader = payload;
      return this.state;
    }
  },
  actions: {
    getCurrentUser({ state, commit, rootState }, payload) {
      if(!rootState.user._id)
        return new Promise((resolve, reject) => { reject(null); })

      return ApiWrapper
        .get("/api/users/" + rootState.user._id)
        .then(res => {
          commit("SET_USER", res.data);
          commit("SET_GLOBAL_LOADER", false);
      
          return res.data;
        });
    },

    setUser({ dispatch, commit }, payload) {
      commit("SET_USER", payload);
      dispatch("getCurrentUser");
      dispatch("getProjects");
    },
    updateUser({ dispatch, commit, rootState }, payload) {
      return ApiWrapper
        .put("/api/users/" + rootState.user._id, payload)
        .then(res => {
          commit("SET_USER", payload);
          return res.data;
        });
    },
    setToken(context, payload) {
      var decoded = jwt_decode(payload);
      context.commit("SET_USER", decoded);
    }
  }
});
