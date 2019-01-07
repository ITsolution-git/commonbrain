<template>
  <div>
      <!-- <ProjectSidebar /> -->
      <FileUpload v-if="fileUpload" :hide="toggleFileUpload" :uploaded="uploaded" />
      <ConfirmDelete :hide="toggleConfirmDelete" :del="deleteThisProject" v-if="confirmDelete"/>
      <Sharing :file="selectedFile" :hide="toggleSharing"   v-if="showSharingModal && selectedFile" @updateFile="updateFile"/>
      <div class="projects-container">
      <div class="main-title">
        <div style="display:flex; align-items:center;">
          <img class="spinner" v-if="isLoading" src="../../img/spinner.svg" alt="">
          {{projectName}}

          <v-tooltip bottom style="">
            <button slot="activator" @click.stop="toggleFileUpload" class="modal-btn btn-icon" type="submit" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}">
              <i class="fa fa-plus"></i>
            </button>
            <span>Add File</span>
          </v-tooltip>

          <v-tooltip bottom style="">
            <button slot="activator" @click.stop="toggleConfirmDelete" class="modal-btn btn-icon" type="submit" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}">
              <i class="fa fa-trash"></i>
            </button>
            <span>Delete Project</span>
          </v-tooltip>
          <!-- <div class="left-sub-sidebar-options">
            <div @click.stop="toggleOptionsDropdown" class="add-project-btn dropdown-btn"><i class="fa fa-ellipsis-h" />
                <div v-click-outside="toggleOptionsDropdown"  v-if="optionsDropdown" class="basic-dropdown add-project-btn-dropdown animated-fast fadeInDown">
                  <ul>
                    <li @click.stop="toggleFileUpload">Add New File</li>
                    <li @click.stop="toggleConfirmDelete">Delete Project</li>
                  </ul>
                </div>
            </div>
          </div> -->

        </div>
      </div>
      
      <div class="standard-inner">
        <table class="standard-table" style="display: flex;flex-direction: column;">
          <thead>
            <tr style="display: flex;"><th style="flex: 3 ">File Name</th><th style="flex: 1">Date Uploaded</th><th style="flex: 1">Date Last Modified</th><th style="flex: 1"></th></tr>
          </thead>
          <tbody>
            
            <tr v-if="filesLoading" class="animated flash infinite" style="display: flex;"><td colspan="3" style="text-align:left; background:#f8fafb; flex: 3"><i class="fa fa-folder-o"></i> <img class="spinner"  src="../../img/spinner.svg" alt=""></td></tr>
            <tr v-if="!filesLoading" v-for="(file,i)  in files" :key="i" style="display: flex;">
              <td style="flex:3"><div  @click="$router.push($route.params.projectId + '/file/'+file._id)" class="project-name"><i class="fa fa-folder-o"></i> <span>{{file.name}}<br><span style="font-size:9pt; color:#66d0f7">New</span></span></div></td>
              <td style="flex:1">{{formatDateTime(file.file_uploaded)}}</td>
              <td style="flex:1">{{formatDateTime(file.file_updated)}}</td>
              <td style="flex:1">
                <v-tooltip bottom style="">
                  <button slot="activator" @click="toggleSharing(file)" class="modal-btn btn-icon" style="" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}">
                    <i class="fa fa-users"></i>
                  </button>
                  <span>Share</span>
                </v-tooltip>
              </td>
            </tr>
            <tr v-if="files.length < 1 && !filesLoading"><td style="background:#fff; border-bottom:solid 1px #eaeaea; height:100px; text-align:left;" colspan="3">No Files</td></tr>
          </tbody>
        </table>
        
      </div>
  </div>
  </div>
</template>
<script>
import FileUpload from "./add_file";
import ProjectSidebar from "./sidebar";
import ConfirmDelete from "../helpers/confirm_delete";
import Sharing from "@/components/shared/file_sharing";
import { mapGetters, mapActions } from 'vuex';
import ApiWrapper from '@/shared/utils/ApiWrapper';
export default {
  name: "view_project",
  data() {
    return {
      fileUpload: false,
      optionsDropdown: false,
      projectName: "",
      isLoading: false,
      confirmDelete: false,
      showSharingModal:false,

      selectedFile: null
    };
  },
  components: {
    ProjectSidebar,
    ConfirmDelete,
    FileUpload,
    Sharing
  },
  methods: {
    ...mapActions(["getFiles", "deleteProject"]),
    toggleSharing(file) {
      this.selectedFile =  Object.assign({}, file);;
      this.showSharingModal = !this.showSharingModal;
    },
    toggleFileUpload() {
      this.fileUpload = !this.fileUpload;
    },
    deleteThisProject() {
      var userId = JSON.parse(JSON.stringify(this.user._id));
      var projectId = JSON.parse(JSON.stringify(this.projectId));
      this.deleteProject({ userId: userId, projectId: projectId });
      this.$router.push("/projects");
      this.confirmDelete = false;
    },
    uploaded() {
      this.fileUpload = false;
      this.getFiles({
        userId: this.$store.state.user.id,
        projectId: this.project._id
      });
    },
    toggleConfirmDelete() {
      this.confirmDelete = !this.confirmDelete;
    },
    toggleOptionsDropdown() {
      this.optionsDropdown = !this.optionsDropdown;
    },
    updateFile(params) {

      ApiWrapper
        .put(
          "/api/files/update/" +
            params._id,
          params.fields
        )
        .then(res => {
          this.getFiles({
            userId: this.$store.state.user.id,
            projectId: this.project._id
          });
        });

    },
    formatDate: function(date2) {
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

      return monthNames[monthIndex] + " " + day + " " + year;
    },
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
  mounted() {
    this.getFiles({ projectId: this.$route.params.projectId });
  },
  computed: {
    files() {
      return this.$store.state.fileStore.files;
    },
    filesLoading() {
      return this.$store.state.fileStore.filesLoading;
    },
    project() {
      var that = this;
      var id = this.$route.params.projectId;
      var projects = JSON.parse(
        JSON.stringify(this.$store.state.projectStore.projects)
      );
      for (var i = 0; i < projects.length; i++) {
        if (id == projects[i]._id) {
          that.projectName = projects[i].project_name;
          return projects[i];
        }
      }
    },
    projectId() {
      return this.$route.params.projectId;
    },
    ...mapGetters({
      user: 'user',
    })
  },
  watch: {
    projectId(val, oldVal) {},
    files(val, oldVal) {
      if (val != oldVal) {
        this.projectName = this.project.project_name;
      }
    },
    project(val, oldVal) {
      if (val != oldVal) {
        this.projectName = val.project_name;
        if (this.projectName != "") {
          this.isLoading = false;
        }
      }
    }
  }
};
</script>
<style>
.project-btns {
  margin-top: 35px;
  padding: 15px;
}
.add-project-btn.dropdown-btn {
  position: relative;
}
</style>

