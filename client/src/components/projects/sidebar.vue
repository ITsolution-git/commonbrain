<template>
<div>
  <AddProject v-if="addProjectOpen" :hide="toggleAddProject" :create="projectCreated"/>
    <div class="sidebar-container ">
        <div class="sidebar-title">
            Projects <i @click="toggleAddProject" class="fa fa-plus"></i>
        </div>
        <div v-if="isLoading" class="spinner-container animated flash infinite">
          <img class="spinner-big"  src="../../img/spinner.svg" alt="">&nbsp;&nbsp;&nbsp;
          <div style="line-height:10px">
            <div style="background:#d0d0d0; height:15px; width:125px; border-radius:20px;"></div><br>
            <div style="background:#dfdfdf; height:10px; width:55px; border-radius:20px;"></div>
          </div>
          
        </div>
        <div v-if="!isLoading" class="project-list animated-fast fadeInLeft">
            <div v-for="(project, i) in projects" :key="i" v-on:mouseover="mouseOver(i)" v-on:mouseout="mouseOver(-1)" class="project-item" :class="{'active':(activeProject == i)}" @click="activateProject(i, project._id)">
                <i class="fa fa-folder-o"></i> 
                <div class="project-item-title">{{project.project_name}} <br> <span class="animated-fast fadeInDown" v-if="hovered == i || activeProject == i">Updated Feb 12</span></div>
                <!-- <div v-if="hovered == i" class="project-item-options animated-fast fadeInRight"><i class="fa fa-ellipsis-h"></i></div> -->
            </div>
            
        </div>
               
    </div>
    </div>
</template>
<script>
import AddProject from "./add_project";
import { mapActions } from "vuex";
export default {
  name: "project-sidebar",
  data() {
    return {
      hovered: -1,
      addProjectOpen: false,
      activeProject: -1,
      isLoading: true
    };
  },
  methods: {
    ...mapActions(["getProjects"]),
    toggleAddProject() {
      this.addProjectOpen = !this.addProjectOpen;
    },
    projectCreated() {
      this.addProjectOpen = false;
      this.activeProject = this.projects.length;
      this.getProjects();
    },
    mouseOver(num) {
      this.hovered = num;
    },
    activateProject(i, id) {
      this.activeProject = i;
      this.$router.push("/projects/" + id);
    }
  },
  computed: {
    projects() {
      return this.$store.state.projectStore.projects;
    },
    projectId() {
      return this.$route.params.id;
    }
  },
  mounted() {
    this.getProjects().then(res => {
      if (this.$route.params.id != null) {
        for (var i = 0; i < this.projects.length; i++) {
          if (this.$route.params.id == this.projects[i]._id) {
            this.activeProject = i;
          }
        }
      }
    });
  },
  watch: {
    projects(val) {
      if (val.length > 0) {
        this.isLoading = false;
      }
    },
    projectId(val) {
      if (val == null) {
        this.getProjects();
      }
    }
  },
  components: {
    AddProject
  }
};
</script>
<style>
.project-item.active {
  background: #fff;
}
.project-item.active i {
  color: #66d0f7;
}
.project-item.active .project-item-title {
  color: #66d0f7;
}
.spinner-container {
  width: 100%;
  display: flex;
  align-items: center;
  padding: 25px;
  background: #eaeaea;
}
.spinner-container i {
  color: #aaa;
}
</style>
