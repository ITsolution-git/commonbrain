<template>
<div>
    <ProjectSidebar />
  <div class="projects-container">
      <div class="main-title">Projects</div>
  </div>
  </div>
</template>
<script>
import ProjectSidebar from "./sidebar";
export default {
  name: "projects",
  data() {
    return {};
  },
  components: {
    ProjectSidebar
  }
};
</script>
<style>
.projects-container {
  position: fixed;
  top: 70px;
  width: 100%;
  left: 300px;
}
.main-title {
  font-size: 15pt;
  padding: 15px;
  display: flex;
  height: 70px;
  align-items: center;
  border-bottom: solid 1px #eaeaea;
  width: 100%;
}
</style>
