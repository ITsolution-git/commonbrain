<template>
  <div>
    <div class="main-container">
      <div class="top-bar"><img src="../../img/brain_white.svg"/></div>
    </div>
    <div class="login-panel">
      <div class="net"></div>
    <form @submit.prevent="submitForm">
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
.forgot-password {
  position: absolute;
  left: 50%;
  bottom: 10px;
  font-size: 9pt;
  color: #d0d0d0;
  -webkit-transform: translateY(-100%);
  transform: translateX(-50%);
  display: inline-block;
}
.top-bar {
  height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #66d0f7;
  position: relative;
  z-index: 10;
}
.logo-container {
  text-align: center;
  width: 100%;
}
.small-logo {
  display: inline-block;
  width: 100px;
  position: relative;
  z-index: 1;
}
.top-bar img {
  height: 70%;
}
form {
  width: 100%;
  padding: 45px 15px;
  background: #f8fafb;
  box-shadow: 1px 1px 2px 0px #f0f0fa;
  border-radius: 3px;
  border: solid 1px #eaeaea;
  max-width: 300px;
  text-align: center;
  overflow: hidden;
  position: relative;
  transform: translateY(-100px);
}
.logo {
  position: absolute;
  top: -108px;
  left: -150px;
  opacity: 0.1;
  z-index: 0;
  pointer-events: none;
  width: 700px;
  display: none;
}
.login-panel {
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 770px;
}
.net {
  background-image: url("../../img/neural_net2.jpg");
  background-size: cover;
  background-position: center center;
  width: 100%;
  height: 50%;
  box-shadow: inset 0px -120px 200px #fff;
  position: absolute;
  top: 0;
  left: 0;
}
.alert-danger {
  padding: 15px;
  border-radius: 3px;
  margin-top: 15px;
  text-align: center;
  z-index: 1;
}
.submit-btn {
  position: relative;
  z-index: 1;
  padding: 7px 45px;
  margin-top: 10px;
}
.login-panel-title {
  text-align: center;
  padding: 15px;
  font-size: 14pt;
  z-index: 1;
  position: relative;
  font-weight: bold;
}
</style>
