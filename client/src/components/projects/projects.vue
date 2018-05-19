<template>
<div>
    <ProjectSidebar/>
    <div class="projects-container" style="background-image:url('../../img/neural_net2.jpg'); background-size:cover; height:100vh;">
      <div class="standard-inner color-bg" style="height:calc(100vh - 70px); display:flex;align-items:center;justify-content:center;" >
        <div style="text-align:center;">
        <img style="width:200px; display:inline-block;margin-bottom:25px;" src="../../img/brain_white.svg" alt=""><br>
        <span style="font-size:16pt; color:#fff;">Welcome To CommonBrain</span>
        </div>
      </div>
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
.color-bg {
  background: linear-gradient(135deg, #66d0f7 0%, #00b1ff 100%);
}
</style>
