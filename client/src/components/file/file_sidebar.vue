<template>
<div>
  <ExportPdf :hide="toggleExportPdf" v-if="exportPdf" />
  <Cropper :upload="toggleCropper"  :hide="toggleCropper" v-if="cropper"></Cropper>
  <ReplaceFile :hide="toggleReplaceFile" :uploaded="submitReplaceFile" v-if="replaceFile" />
    <div class="sidebar-container">
        <div @click="$router.go(-1)" class="standard-btn back"><i class="fa fa-angle-left"></i> Back</div>
        <div class="sidebar-title" v-if="file[0]">
          {{file[0].name}}
            <div class="left-sub-sidebar-options">
            <div @click.stop="toggleOptionsDropdown" class="add-project-btn dropdown-btn"><i class="fa fa-ellipsis-h" />
                <div v-click-outside="toggleOptionsDropdown"  v-if="optionsDropdown" class="basic-dropdown add-project-btn-dropdown animated-fast fadeInDown">
                  <ul>
                    <li @click="deleteFile">Delete File</li>
                    <li @click="downloadFile">Download File</li>
                    <li @click="toggleReplaceFile">Replace File</li>
                    <li @click="toggleExportPdf">Export PDF</li>
                    <li @click="$router.push('/projects/'+projectId + '/rawfile/'+fileId)">Edit Charts</li>
                  </ul>
                </div>
            </div>
          </div>
        </div>
        <div @click="toggleCropper" class="file-logo">
          <div v-if="!hasImage" style="padding:15px">
            <i class="fa fa-camera" style=" margin-right:10px;"></i>
            Add Image
            </div>
            <img v-if="hasImage" :src="imagePath" alt="">
        </div>
        <!-- <div class="file-image">
            
        </div> -->
        <div class="dash-nav" v-if="activeDash" @click="showSelectDash(true)">
          <span>{{activeDash.dashName}}</span>
          <i class="fa fa-angle-right" ></i>
        </div>
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
import { deleteRequest } from "../helpers/api_helper";
import { mapActions } from "vuex";
import ApiWrapper from '@/shared/utils/ApiWrapper';
import ReplaceFile from "./replace_file";
import ExportPdf from "./export_pdf";

export default {
  name: "file-sidebar",
  props: ["sheets", "activate", "dashes", "activeDash", "showSelectDash"],
  data() {
    return {
      hovered: 0,
      addProjectOpen: false,
      activeNav: 0,
      cropper: false,
      hasImage: false,
      imagePath: "",
      optionsDropdown: false,
      replaceFile: false,
      exportPdf: false
    };
  },
  components: {
    Cropper,
    ReplaceFile,
    ExportPdf
  },
  mounted() {
    var that = this;
    setTimeout(function() {
      that.getImage();
      if (that.file && that.file.length > 0) {
        this.hasImage = true;
      }
    }, 10);
  },
  methods: {
    ...mapActions(["getFiles"]),
    toggleExportPdf() {
      this.exportPdf = !this.exportPdf;
    },
    submitReplaceFile() {
      this.replaceFile = !this.replaceFile;
      window.location.reload();
    },
    toggleReplaceFile() {
      this.replaceFile = !this.replaceFile;
    },
    toggleOptionsDropdown() {
      this.optionsDropdown = !this.optionsDropdown;
    },
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
      this.showSelectDash(false);
      this.activate(sheet);
    },
    deleteFile() {
      deleteRequest(
        "/api/files/" +
          this.$store.state.user.id +
          "/" +
          this.$route.params.projectId +
          "/" +
          this.$route.params.fileId
      ).then(() => {
        this.getFiles({ project_id: this.$route.params.projectId });
        this.$router.go(-1);
      });
    },
    downloadFile() {
      ApiWrapper
        .download(
          "/api/files/download/" +
            this.$store.state.user.id +
            "/" +
            this.$route.params.projectId +
            "/" +
            this.$route.params.fileId,
          { responseType: "arraybuffer" }
        )
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", this.file[0].filename);
          document.body.appendChild(link);
          link.click();
        });
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
    },
    fileId() {
      return this.$route.params.fileId;
    },
    projectId() {
      return this.$route.params.projectId;
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
  margin-top: 10px;
}
.file-nav li {
  padding: 10px 20px;
  font-size: 17px;
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

.dash-nav{
  margin-top: 30px;
  padding: 0px 15px;
  font-size: 20px;
  cursor: pointer;
  justify-content: space-between;
  flex-direction: row;
  display: flex;
}
.dash-nav:hover{
  color: #66d0f7;
}
.dash-nav i {
  transition: all 0.5s;
  margin-right: 10px;

}
.dash-nav:hover i {
  margin-right: 0px;
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
