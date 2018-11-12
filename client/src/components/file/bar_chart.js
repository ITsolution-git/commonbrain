import { Bar, mixins } from "vue-chartjs";
const { reactiveProp } = mixins;

import { mapGetters, mapActions } from 'vuex';
export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ["chartData", "options", "height"],

  mounted() {
    this.renderChart(this.chartData, this.options);
  }
};
