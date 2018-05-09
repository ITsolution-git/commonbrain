<template>
  <div>
      <ProjectSidebar />
      <div class="projects-container">
      <div class="main-title">Project {{$route.params.id}}</div>
      <div class="standard-inner">
      <table class="standard-table">
        <tbody>
          <tr><th>File Name</th><th>File Date</th></tr>
          <tr><td><div  @click="$router.push('/projects/1/file/1')" class="project-name"><i class="fa fa-folder-o"></i> <span>Test File<br><span style="font-size:9pt; color:#66d0f7">New</span></span></div></td><td>November 1, 2017</td></tr>
        </tbody>
      </table>
      <div class="standard-btn delete">Delete Project</div>
      </div>
  </div>
  </div>
</template>
<script>
import ProjectSidebar from "./sidebar";
export default {
  name: "view_project",
  data() {
    return {};
  },
  components: {
    ProjectSidebar
  }
};
</script>
<style>

</style>

