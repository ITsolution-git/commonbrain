<template>
  <div style="margin-top: 200px; text-align: center">
    <img src="../img/brain.svg" alt="" class="pulse">
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  name: "loader",
  data() {
    return {
    };
  },
  watch:{
  }, 
  methods: {
  }
};
</script>
<style>

.pulse {
  width: 100px;
  cursor: pointer;
  box-shadow: 0 0 0 rgba(204,169,44, 0.4);
  animation: pulse 0.8s infinite;
}
.pulse:hover {
  animation: none;
}

@-webkit-keyframes pulse {
  0% {
    -webkit-box-shadow: 0 0 0 0 rgba(204,169,44, 0.4);
  }
  70% {
      -webkit-box-shadow: 0 0 0 10px rgba(204,169,44, 0);
  }
  100% {
      -webkit-box-shadow: 0 0 0 0 rgba(204,169,44, 0);
  }
}
@keyframes pulse {
  0% {
    width: 100px;
    opacity: 0.8;
  }
  70% {
    width: 110px;
    opacity: 1;
  }
  100% {
    width: 100px;
    opacity: 0.8;
  }
}
</style>
