<template>
  <div>
    <div class="no-sidebar-container">
      <div class="main-title">Templates</div>
    </div>
    <div class="templates-cont">
      <table class="standard-table">
        <tbody>
          <tr><th>Name</th><th>Description</th><th></th></tr>
          <tr v-for="(item,i)  in templates" :key="i">
            <td><span>{{item.name}}</span></td>
            <td><span>{{item.description}}</span></td>
            <td>
              <a href="#" @click="download(item)">Download this file</a>
            </td>
          </tr>
          
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input";
import ApiWrapper from '@/shared/utils/ApiWrapper';

import { mapGetters, mapActions } from 'vuex';
export default {
  name: "ofac",
  data() {
    return {
      templates: [{
        id: 1,
        name: 'Full Power Template',
        filename: 'Full Power Template.xlsx',
        description: 'Template with Commainbrain DashItems and Commonbrain Images',
      }]
    };
  },
  components: {
    StandardInput
  },
  mouted() {},
  methods: {
    download(item) {
      let self = this;
      ApiWrapper
        .download(
          "/api/templates/download/" + item.id,
          { responseType: "arraybuffer" }
        )
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", item.filename);
          document.body.appendChild(link);
          link.click();
        });
    }

  },
  computed: {
    ...mapGetters({
      user: 'user',
    })
  }
};
</script>
<style>

</style>
