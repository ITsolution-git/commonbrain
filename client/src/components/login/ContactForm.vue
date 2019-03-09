<template lang="html">
  <v-layout column wrap justify-center align-center>
    <v-alert
      :value="showAlert"
      color="#66d0f7"
      style="width: 400px"
    >
      Thank you for your contact. We will reach you soon.
    </v-alert>

    <v-form
      ref="contactForm"
      v-model="valid"
      lazy-validation
      style="width: 400px"
    >
      <v-flex xs12>
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="E-mail"
          required
        ></v-text-field>

        <v-textarea
          label="Message..."
          v-model="description"
        ></v-textarea>

        <v-btn
          color="#66d0f7"
          style="color: #fff"
          @click="validate"
          :disabled="showAlert"
        >
          Contact
        </v-btn>

      </v-flex>
    </v-form>
  </v-layout>
</template>
<script>
import auth from "../../auth";
export default {
  name: "ContactForm",
  props: [],
  data() {
    return {
      showAlert: false,

      valid: true,
      email: '',
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+/.test(v) || 'E-mail must be valid'
      ],
      description: ''
    };
  },
  $_veeValidate: {
    validator: "new" // give me a new validator each time.
  },
  methods: {
    validate () {
      if (this.$refs.contactForm.validate()) {
        this.showAlert = true; 
      }
    },
  }
};
</script>
<style>
</style>


