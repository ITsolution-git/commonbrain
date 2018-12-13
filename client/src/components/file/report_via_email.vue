<template>
  <div>
    <div class="overlay animated-fast" :class="{'fadeIn': !hidden,'fadeOut':hidden}">
      <div class="modal-1 animated-fast zoomIn" :class="{'zoomIn': !hidden,'zoomOut':hidden}">
          <div class="modal-top">
              <div class="modal-title">Send Report</div>
              <div class="modal-close"><i @click="hideThis" class="fa fa-close"></i></div>
          </div>
          <form @submit.prevent="sendReport">
          <div class="modal-inner">
             
            <StandardInput
              field="Email Address"
              v-model="emailAddress"
              width="100%"
              placeholder="Email..."
            />
              
          </div>
          <div v-if="hasError" class="alert-danger animated fadeIn" style="color:#ff0000; margin:15px;">{{errorMessage}}</div>
          <div class="modal-buttons">
              <div @click="hideThis" class="modal-btn cancel">Cancel</div>
              <button class="modal-btn confirm" type="submit" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}"><span v-if="!isLoading">Send</span> <img v-if="isLoading" style="width:25px" src="../../img/spinner_white.svg"/></button>
          </div>
          </form>
          </div>
      </div>
  </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input";
import StandardSelect from "../form_elements/custom_select";
import ApiWrapper from '@/shared/utils/ApiWrapper';
import auth from "../../auth.js";
import { mapGetters, mapActions } from 'vuex';
export default {
  name: "report_via_email",
  data() {
    return {
      hidden: false,
      emailAddress: "",
      hasError: false,
      errorMessage: "",
      isLoading: false,
    };
  },
  props: ["hide"],
  methods: {
    submit() {},
    hideThis() {
      var that = this;
      this.hidden = true;
      setTimeout(function() {
        that.hide();
      }, 300);
    },
    sendReport(e) {
      this.isLoading = true;
      var that = this;
      ApiWrapper
        .post(
          "/api/files/report/sendreport/" +
            this.$route.params.fileId,
          {
            emailAddress: this.emailAddress
          }
        )
        .then(
          res => {

            this.isLoading = false;
            setTimeout(function() {
              that.hide();
            }, 300);
            
            //console.log(res.data);
          },
          err => {
            this.hasError = true;
            this.isLoading = false;
            if (err.response && err.response.data.errors)
              this.errorMessage = err.response.data.errors.form;
            else if(err.response && err.response.data.error)
              this.errorMessage = err.response.data.errors.message;
            else
              this.errorMessage = 'Something went wrong';
          }
        );
    }
  },
  computed: {
    userId() {
      return this.$store.state.user.id;
    },
    ...mapGetters({
      user: 'user',
    }),
  },
  components: {
    StandardInput,
    StandardSelect
  }
};
</script>
<style>
</style>
