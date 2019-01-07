<template>
<v-app id="app">

  <vue-progress-bar></vue-progress-bar>
  <router-view name="header"></router-view>
  <router-view name="login"></router-view>


  <div v-if="globalLoader">
    <Loader />
  </div>
  <router-view v-if="!globalLoader">
    
  </router-view>
</v-app>
</template>

<script>
import Loader from './components/loader'
import jwt_decode from "jwt-decode";
import { mapGetters, mapActions } from 'vuex';
const fakeUser = { theme: '#66d0f7', showHoverOnExport: false, buttonBorder: {hex: '#4a4a4a'}, showButtonBorders: true, fillButtons: true, showHyperlink: true};
export default {
  name: "App",
  components: {
    Loader
  },
  methods: {
    ...mapActions(["setToken", "setUser"])
  },
  data() {
    return {
    };
  },

  computed: {
    ...mapGetters({
      globalLoader: 'globalLoader',
    }),

  },
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setToken(token);

      setTimeout(()=>{
        this.$store.dispatch('getCurrentUser').then(res=>{
        }).catch(err=>{
          this.$store.commit("SET_USER", fakeUser);
          this.$store.commit("SET_GLOBAL_LOADER", false);
        });
      }, 2000)
    } else {
      // this.$router.push("/");
      // Can setup fake user account.
      this.$store.commit("SET_USER", fakeUser);
      this.$store.commit("SET_GLOBAL_LOADER", false);
    }
  },
  mounted() {
  }
};
</script>
