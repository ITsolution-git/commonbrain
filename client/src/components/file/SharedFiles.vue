<template>
  <div>
    <div class="no-sidebar-container">
      <div class="main-title">Shared Files</div>
    </div>

    <div v-if="isLoading"  style="display:flex; align-items:center; justify-content:center;width:100%; height:100%;">

      <img class="spinner-big" src="../../img/spinner.svg" alt="">
    </div>

    <div class="templates-cont" v-else>

      <table class="standard-table" style="display: flex;flex-direction: column;">
        <thead>
          <tr style="display: flex;"><th style="flex: 3 ">File Name</th><th style="flex: 1">Date Uploaded</th><th style="flex: 1">Date Last Modified</th><th style="flex: 1"></th></tr>
        </thead>
        <tbody>
          <tr v-for="(file,i)  in files" :key="i" style="display: flex;">
            <td style="flex:3"><div  @click="$router.push('/projects/' + file.project_id + '/file/'+file._id)" class="project-name"><i class="fa fa-folder-o"></i> <span>{{file.name}}<br><span style="font-size:9pt; color:#66d0f7">Shared</span></span></div></td>
            <td style="flex:1">{{formatDateTime(file.file_uploaded)}}</td>
            <td style="flex:1">{{formatDateTime(file.file_updated)}}</td>
            <td style="flex:1">S </td>
          </tr>
          <tr>
            <td colspan="4" v-if="files.length == 0" style="margin: 20px; text-align: center">
              No Files Shared
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>

import ApiWrapper from '@/shared/utils/ApiWrapper';

import { mapGetters, mapActions } from 'vuex';
export default {
  name: "shared_files",
  data() {
    return {
      files: [],
      isLoading: true
    };
  },
  components: {
  },
  mouted() {},
  methods: {

    formatDateTime(date2) {
      var date = new Date(date2);
      var monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sept",
        "Oct",
        "Nov",
        "Dec"
      ];

      var day = date.getDate();
      var monthIndex = date.getMonth();
      var year = date.getFullYear();
      var time = date.toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true
      });

      return time + " " + monthNames[monthIndex] + " " + day + " " + year;
    }
  },
  computed: {
    ...mapGetters({
      user: 'user',
    })
  },
  mounted() {
    this.isLoading = true;
    return ApiWrapper
      .post("/api/files/shared", {email: this.user.email})
      .then(res => {
        this.files = res.data;
        this.isLoading = false;
      });
  }
};
</script>
<style>

</style>
