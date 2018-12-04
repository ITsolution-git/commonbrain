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

        });
      }, 2000)
    } else {
      this.$router.push("/");
    }
  },
  mounted() {
  }
};
</script>
