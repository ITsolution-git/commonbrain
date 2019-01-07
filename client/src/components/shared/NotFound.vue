<template>
  <div style="display: flex; flex: 1; height: calc(100vh - 70px); align-items: center; justify-content: center; flex-direction: column">
    <h3 style="color: #4a4a4a; font-size: 100px">404</h3>
    <br/>
    <h2 style="color: #4a4a4a">NOT FOUND</h2>
  </div>
</template>
<script>
import sadImage from '@/img/sad.png'
import { mapMutations } from "vuex";
import { mapGetters, mapActions } from 'vuex';
export default {
  name: "NotFound",
  data() {
    return {
      sadImage: sadImage
    };
  },
  computed: {
    ...mapGetters({
      user: 'user',
    }),

  },
  watch:{
  }, 
  methods: {
  },
  components: {
  }
};
</script>
<style lang="scss">
</style>
