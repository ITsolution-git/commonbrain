import Vue from "vue";
import Vuex from "vuex";
import jwt_decode from "jwt-decode";

Vue.use(Vuex);

export const store = new Vuex.Store({
  modules: {},
  state: {
    user: {}
  },
  getters: {},
  mutations: {
    SET_USER(state, payload) {
      var user = payload;
      this.state.user = user;
      return this.state.user;
    }
  },
  actions: {
    setUser(context, payload) {
      context.commit("SET_USER", payload);
    },
    setToken(context, payload) {
      var decoded = jwt_decode(payload);
      context.commit("SET_USER", decoded);
    }
  }
});
