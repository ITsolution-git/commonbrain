<template lang="html">
  <div v-bind:class="{'overlay animated-fast fadeIn':visible,'overlay animated-fast fadeOut':!visible}" >
    <div v-bind:class="{'modal-1 animated-fast zoomIn':visible,'modal-1 animated-fast zoomOut':!visible}" style="width: 400px">
      <form class="login-form" @submit.prevent="submitForm">
      <div class="logo-container">
        <img class="small-logo" src="../../img/brain.svg" alt="">
      </div>
      <img class="logo" src="../../img/logo_1.png" alt="">
      <div class="login-panel-title">Login To CommonBrain</div>
        <div class="login-box-input-item">
          <div class="login-box-input-icon"><i class="fa fa-user-circle-o" /></div>
            <input type="text" id="username" name="username" placeholder="Username" class="css-login-input-input" />
        </div>
    <div class="login-box-input-item">
          <div class="login-box-input-icon"><i class="fa fa-lock" /></div>
            <input type="password" id="password" name="password" placeholder="Password" class="css-login-input-input" />
        </div>
    
    <div class="modal-btn-container">
        <div @click="toggleVisible" class="modal-btn cancel">Cancel</div>
    <button class="modal-btn confirm" type="submit">Login</button>
    <div v-if="hasError" class="alert-danger animated fadeIn" style="color:#ff0000">{{errorMessage}}</div>
    </div>
    <div class="forgot-password">Forgot Password?</div>
    </form>
    </div>
    </div>
</template>
<script>
export default {
  name: "login_form",
  props: ["hide", "login"],
  data() {
    return {
      visible: true
    };
  },
  methods: {
    toggleVisible() {
      var that = this;
      this.visible = false;
      setTimeout(function() {
        that.hide();
      }, 300);
    }
  }
};
</script>
