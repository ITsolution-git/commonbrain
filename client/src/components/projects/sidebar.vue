<template>
    <div class="sidebar-container">
        <div class="sidebar-title">
            Projects <i class="fa fa-plus"></i>
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
</template>
<script>
export default {
  name: "project-sidebar",
  data() {
    return {
      hovered: 0
    };
  },
  methods: {
    mouseOver(num) {
      this.hovered = num;
    }
  }
};
</script>
<style>
.sidebar-container {
  position: fixed;
  height: 100vh;
  width: 300px;
  background: #f8fafb;
  border: solid 1px #eaeaea;
  box-shadow: 1px 1px 5px #eceeef;
  margin-top: 70px;
  top: 0;
}
.sidebar-title {
  font-size: 13pt;
  display: flex;
  align-items: center;
  padding: 15px;
}
.sidebar-title i {
  background: #fff;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 1px #eaeaea;
  border-radius: 3px;
  margin-left: auto;
  font-size: 10pt;
  transition: box-shadow 0.2s ease;
  cursor: pointer;
  box-shadow: 0px 0px 0px 0px #66d0f7;
}
.sidebar-title i:hover {
  background: #66d0f7;
  border: solid 1px #66d0f7;
  color: #fff;
  box-shadow: 0px 0px 0px 2px #66d0f7;
}
.sidebar-title i:active {
  background: #35c0f4;
  border: solid 1px #35c0f4;
}
.project-list {
  border-top: solid 1px #eaeaea;
  margin-top: 50px;
}
.project-item {
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: solid 1px #eaeaea;
  line-height: 14pt;
  height: 70px;
}
.project-item:hover {
  background: #fff;
}
.project-item:hover i {
  color: #66d0f7;
}
.project-item:hover .project-item-title {
  color: #66d0f7;
}
.project-item-title {
  font-size: 13pt;
  color: #5c7c83;
  cursor: pointer;
}
.project-item-title span {
  font-size: 10pt;
  color: #d0d0d0;
  display: inline-block;
}
.project-item i {
  margin-right: 15px;
  cursor: pointer;
  color: #d0d0d0;
}
.project-item i:hover {
  color: #000;
}
.project-item-options {
  opacity: 0;
  margin-left: auto;
}
.project-item:hover .project-item-options {
  opacity: 1;
}
</style>
