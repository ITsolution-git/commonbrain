<template>
<div>
  <Cropper :upload="toggleCropper"  :hide="toggleCropper" v-if="cropper"></Cropper>
    <div class="sidebar-container">
        <div @click="$router.go(-1)" class="standard-btn back"><i class="fa fa-angle-left"></i> Back</div>
        <div class="sidebar-title">
            
        </div>
        <div @click="toggleCropper" class="file-logo">
          <div v-if="!hasImage" style="padding:15px">
            <i class="fa fa-camera"></i>
            Add Image
            </div>
            <img v-if="hasImage" :src="imagePath" alt="">
        </div>
        <!-- <div class="file-image">
            
        </div> -->
        <div class="file-nav">
            <ul>
                <li v-for="(sheet,i) in sheets" :key="i" :class="{'active':(activeNav == i)}" @click="activateSheet(i,sheet)">{{sheet}}</li>
            </ul>
        </div>
               
    </div>
    </div>
</template>
<script>
import Cropper from "./cropper";
export default {
  name: "file-sidebar",
  props: ["sheets", "activate"],
  data() {
    return {
      hovered: 0,
      addProjectOpen: false,
      activeNav: 0,
      cropper: false,
      hasImage: false,
      imagePath: ""
    };
  },
  components: {
    Cropper
  },
  mounted() {
    var that = this;
    setTimeout(function() {
      that.getImage();
      if (that.file[0].image) {
        this.hasImage = true;
      }
    }, 10);
  },
  methods: {
    toggleCropper: function() {
      this.cropper = !this.cropper;
    },
    toggleAddProject() {
      this.addProjectOpen = !this.addProjectOpen;
    },
    mouseOver(num) {
      this.hovered = num;
    },
    activateSheet(i, sheet) {
      this.activeNav = i;
      this.activate(sheet);
    },
    getImage() {
      this.imagePath =
        "/api/static/" +
        this.$store.state.user.id +
        "/" +
        this.$route.params.projectId +
        "/" +
        this.$route.params.fileId +
        ".jpg";
    }
  },
  computed: {
    file() {
      return this.$store.state.fileStore.file;
    }
  },
  watch: {
    file(val, oldVal) {
      if (val != oldVal) {
        if (val[0].image) {
          this.hasImage = true;
        }
      }
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
.file-logo img,
.file-logo div {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef0f2;
}
.file-logo div:hover {
  cursor: pointer;
  background: #e2e5e7;
}
.standard-btn.back {
  display: inline-flex;
  position: relative;
  background: #f8fafb;
  border: solid 1px #eaeaea;
  color: #808080;
  max-width: 100px;
  margin-bottom: 15px;
  bottom: unset !important;
  margin: unset !important;
  right: unset !important;
  margin: 15px !important;
  float: none;
}
.standard-btn.back i {
  margin-right: 10px;
}
.standard-btn.back:hover {
  background: #eff1f2;
  cursor: pointer;
}
</style>
