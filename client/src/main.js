import Vue from "vue";
import App from "./App";
import router from "./router";
import VueResource from "vue-resource";
import { store } from "./store/store.js";
import VeeValidate from "vee-validate";
import VTooltip from "v-tooltip";
import vSelect from "vue-select";
import VueCroppie from "vue-croppie";
import Loader from "vue-spinner/src/RingLoader.vue";

require("./css/bootstrap.min.css");
require("./css/font-awesome.min.css");
require("./css/css.css");
require("./css/animate.css");
require("./css/tooltip.css");

Vue.config.productionTip = false;
Vue.use(VueResource);
Vue.use(VTooltip);
Vue.use(VeeValidate, { inject: false });
Vue.use(VueCroppie);
Vue.component("v-select", vSelect);
Vue.component("v-loader", Loader);

Vue.directive("click-outside", {
  bind: function(el, binding, vnode) {
    el.event = function(event) {
      // here I check that click was outside the el and his childrens
      if (!(el === event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.event);
  },
  unbind: function(el) {
    document.body.removeEventListener("click", el.event);
  }
});

// Vue.options.beforeCreate.pop();
// Vue.options.mounted.pop();

/* eslint-disable no-new */
new Vue({
  el: "#app",
  router,
  store,
  components: { App },
  template: "<App/>"
});
