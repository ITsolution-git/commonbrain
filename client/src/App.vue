<template>
<v-app id="app">

  <router-view name="header"></router-view>
  <router-view name="login"></router-view>


  <div v-if="loader">
    Loading
  </div>
  <router-view v-if="!loader">
    
  </router-view>
</v-app>
</template>

<script>
import { mapActions } from "vuex";
import Loader from './components/loader'
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
      loader: true,
    };
  },
  created() {
    const token = localStorage.getItem("token");
    if (token) {
      this.setToken(token);
    } else {
      this.$router.push("/");
    }
  },
  mounted() {
    this.$store.dispatch('getCurrentUser').then(res=>{
      setTimeout(()=>{
        this.loader = false;  
      }, 506660)
    });
    // const token = localStorage.getItem("token");
    // if (token) {
    //   // this.setToken(token);
    //   // this.setUser(decode(token));
    // } else {
    //   this.$router.push("/");
    // }
  }
};
</script>
