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
    user: {}
  },
  getters: {
    user: (state)=>state.user
  },
  mutations: {
    SET_USER(state, payload) {
      var user = payload;
      this.state.user = user;
      return this.state.user;
    }
  },
  actions: {
    getCurrentUser({ state, commit, rootState }, payload) {
      return ApiWrapper
        .get("/api/users/" + rootState.user._id)
        .then(res => {
          commit("SET_USER", res.data);
          return res.data;
        });
    },

    setUser({ dispatch, commit }, payload) {
      commit("SET_USER", payload);
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
