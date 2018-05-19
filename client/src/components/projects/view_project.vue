<template>
  <div>
      <ProjectSidebar />
      <FileUpload v-if="fileUpload" :hide="toggleFileUpload" :uploaded="uploaded" />
      <ConfirmDelete :hide="toggleConfirmDelete" :del="deleteThisProject" v-if="confirmDelete"/>
      <div class="projects-container">
      <div class="main-title">
        <div style="display:flex; align-items:center;">
          <img class="spinner" v-if="isLoading" src="../../img/spinner.svg" alt="">
          {{projectName}}
          <div class="left-sub-sidebar-options">
            <div @click.stop="toggleOptionsDropdown" class="add-project-btn dropdown-btn"><i class="fa fa-ellipsis-h" />
                <div v-click-outside="toggleOptionsDropdown"  v-if="optionsDropdown" class="basic-dropdown add-project-btn-dropdown animated-fast fadeInDown">
                  <ul>
                    <li @click.stop="toggleFileUpload">Add New File</li>
                    <li @click.stop="toggleConfirmDelete">Delete Project</li>
                    
                  </ul>
                </div>
            </div>
          </div>

        </div>
      </div>
      
      <div class="standard-inner">
        <table class="standard-table">
          <tbody>
            <tr><th>File Name</th><th>Date Uploaded</th><th>Date Last Modified</th></tr>
            <tr v-if="filesLoading" class="animated flash infinite"><td colspan="3" style="text-align:left; background:#f8fafb"><i class="fa fa-folder-o"></i> <img class="spinner"  src="../../img/spinner.svg" alt=""></td></tr>
            <tr v-if="!filesLoading" v-for="(file,i)  in files" :key="i"><td><div  @click="$router.push($route.params.id + '/file/'+file._id)" class="project-name"><i class="fa fa-folder-o"></i> <span>{{file.name}}<br><span style="font-size:9pt; color:#66d0f7">New</span></span></div></td><td>{{formatDateTime(file.file_uploaded)}}</td><td>{{formatDateTime(file.file_updated)}}</td></tr>
            
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
import { mapActions } from "vuex";
export default {
  name: "view_project",
  data() {
    return {
      fileUpload: false,
      optionsDropdown: false,
      projectName: "",
      isLoading: true,
      filesLoading: true,
      confirmDelete: false
    };
  },
  components: {
    ProjectSidebar,
    ConfirmDelete,
    FileUpload
  },
  methods: {
    ...mapActions(["getFiles", "deleteProject"]),
    toggleFileUpload() {
      this.fileUpload = !this.fileUpload;
    },
    deleteThisProject() {
      var userId = JSON.parse(JSON.stringify(this.$store.state.user.id));
      var projectId = JSON.parse(JSON.stringify(this.projectId));
      this.deleteProject({ userId: userId, projectId: projectId });
      this.$router.push("/projects");
      this.confirmDelete = false;
    },
    uploaded() {
      this.fileUpload = false;
      this.filesLoading = true;
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
  mounted() {},
  computed: {
    files() {
      return this.$store.state.fileStore.files;
    },
    project() {
      var id = this.$route.params.id;
      var projects = JSON.parse(
        JSON.stringify(this.$store.state.projectStore.projects)
      );
      for (var i = 0; i < projects.length; i++) {
        if (id == projects[i]._id) {
          return projects[i];
        }
      }
    },
    projectId() {
      return this.$route.params.id;
    }
  },
  watch: {
    projectId(val, oldVal) {
      if (val != oldVal) {
        this.filesLoading = true;
      }
    },
    files(val) {
      if (val != null) {
        this.filesLoading = false;
      }
    },
    project(val) {
      if (val != null) {
        this.projectName = val.project_name;
        if (this.projectName != "") {
          this.isLoading = false;
          this.getFiles({
            userId: this.$store.state.user.id,
            projectId: this.project._id
          });
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

