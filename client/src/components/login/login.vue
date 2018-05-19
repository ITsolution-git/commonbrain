<template>
  <div>
    <div class="main-container">
      <div class="top-bar"><img src="../../img/brain_white.svg"/></div>
    </div>
    <div class="login-panel">
      <div class="net"></div>
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
    <button class="submit-btn" type="submit">Login</button>
    <div v-if="hasError" class="alert-danger animated fadeIn" style="color:#ff0000">{{errorMessage}}</div>
    <div class="forgot-password">Forgot Password?</div>
    </form>
    </div>
  </div>
</template>
<script>
import auth from "../../auth.js";
import StandardInput from "../form_elements/standard_input";
import { mapActions } from "vuex";
export default {
  name: "login",
  data() {
    return {
      hasError: false,
      errorMessage: ""
    };
  },
  $_veeValidate: {
    validator: "new" // give me a new validator each time.
  },
  methods: {
    ...mapActions(["setUser"]),
    submitForm() {
      var form = event.target;
      var data = new FormData(form);
      data = data.entries();
      var obj = data.next();
      var retrieved = {};
      while (undefined !== obj.value) {
        retrieved[obj.value[0]] = obj.value[1];
        obj = data.next();
      }
      auth.login(retrieved).then(
        res => {
          this.setUser(res);
        },
        err => {
          console.log(err);
          this.errorMessage = err.response.data.error;
          this.hasError = true;
        }
      );
    }
  },
  components: {
    StandardInput
  }
};
</script>
<style>
</style>
