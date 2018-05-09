<template>
<div>
  <AddProject v-if="addProjectOpen" :hide="toggleAddProject"/>
    <div class="sidebar-container">
        <div class="sidebar-title">
            Project 1 <i @click="toggleAddProject" class="fa fa-plus"></i>
        </div>
        <div class="project-list">
            <div v-on:mouseover="mouseOver(1)" v-on:mouseout="mouseOver(0)" class="project-item">
                <i class="fa fa-folder-o"></i> 
                <div class="project-item-title">Project 1 <br> <span class="animated-fast fadeInDown" v-if="hovered == 1">Updated Feb 12</span></div>
                <div v-if="hovered == 1" class="project-item-options animated-fast fadeInRight"><i class="fa fa-ellipsis-h"></i></div>
            </div>
            <div v-on:mouseover="mouseOver(2)" v-on:mouseout="mouseOver(0)" class="project-item">
                <i class="fa fa-folder-o"></i> 
                <div class="project-item-title">Project 2 <br> <span class="animated-fast fadeInDown" v-if="hovered == 2">Updated Feb 12</span></div>
                <div v-if="hovered == 2" class="project-item-options animated-fast fadeInRight"><i class="fa fa-ellipsis-h"></i></div>
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
      hovered: 0,
      addProjectOpen: false
    };
  },
  methods: {
    ...mapActions(["getProjects"]),
    toggleAddProject() {
      this.addProjectOpen = !this.addProjectOpen;
    },
    mouseOver(num) {
      this.hovered = num;
    }
  },
  components: {
    AddProject
  }
};
</script>
<style>

</style>
