<template>
<div>

    <div class="sidebar-container">
        <div @click="$router.go(-1)" class="standard-btn back"><i class="fa fa-angle-left"></i> Back</div>
        <div class="sidebar-title">
            File {{$route.params.id}} 
        </div>
        <div class="file-logo">
            <img src="../../img/appfolio.png" alt="">
        </div>
        <div class="file-image">
            
        </div>
        <div class="file-nav">
            <ul>
                <li :class="{'active':activeNav == 1}">Asset Summary</li>
                <li>Summary</li>
                <li>Summary 23</li>
            </ul>
        </div>
               
    </div>
    </div>
</template>
<script>
export default {
  name: "file-sidebar",
  data() {
    return {
      hovered: 0,
      addProjectOpen: false,
      activeNav: 1
    };
  },
  methods: {
    toggleAddProject() {
      this.addProjectOpen = !this.addProjectOpen;
    },
    mouseOver(num) {
      this.hovered = num;
    }
  }
};
</script>
<style>
.file-nav {
  margin-top: 15px;
}
.file-nav li {
  padding: 15px;
}
.file-nav li:hover {
  color: #66d0f7;
  cursor: pointer;
}
.file-nav li.active {
  color: #66d0f7;
  background: #fff;
}
.file-image {
  background-image: url(../../img/epic_building.jpg);
  background-size: cover;
  background-position: center;
  height: 150px;
  width: 100%;
}
.file-logo img {
  width: 100%;
  padding: 15px;
}
.standard-btn.back {
  top: 15px;
  left: 15px;
  display: inline-flex;
  position: relative;
  background: #f8fafb;
  border: solid 1px #eaeaea;
  color: #808080;
  max-width: 100px;
  margin-bottom: 15px;
}
.standard-btn.back i {
  margin-right: 10px;
}
.standard-btn.back:hover {
  background: #eff1f2;
  cursor: pointer;
}
</style>
