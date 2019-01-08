<template>
<div>
  <ExportPdf :hide="toggleExportPdf" v-if="exportPdf" />
  <Cropper :upload="toggleCropper"  :hide="toggleCropper" v-if="cropper" imgType="logo"></Cropper>
  <ReplaceFile :hide="toggleReplaceFile" :uploaded="submitReplaceFile" v-if="replaceFile" />
  <ReportViaEmail :hide="toggleReportViaEmail"   v-if="reportViaEmail"/>
  <ConfirmDelete :hide="toggleConfirmDelete" :del="deleteFile" v-if="confirmDelete"/>
  
  <div class="sidebar-container">
      <div style="display: flex; margin: 10px">
        <div @click="$router.go(-1)" class="standard-btn back" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}"><i class="fa fa-angle-left"></i> Back</div>

        <v-tooltip bottom style="">
          <button slot="activator" @click="toggleReplaceFile" class="modal-btn btn-icon" style="" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}" v-if="pems.indexOf('write')!=-1">
            <i class="fa fa-upload"></i>
          </button>
          <span>Replace file</span>
        </v-tooltip>
        
        <!-- <button @click="deleteFile" class="modal-btn btn-icon" style="" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}">
          <i class="fa fa-trash"></i>
        </button> -->

        <v-tooltip bottom style="">
          <button slot="activator" @click="downloadFile" class="modal-btn btn-icon" style="" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}" v-if="pems.indexOf('download')!=-1">
            <i class="fa fa-download"></i>
          </button>
          <span>Download</span>
        </v-tooltip>
        <v-tooltip bottom style="">
          <button slot="activator" @click="toggleExportPdf" class="modal-btn btn-icon" style="" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}">
            <i class="fa fa-file-pdf-o"></i>
          </button>
          <span>Export PDF</span>
        </v-tooltip>
        <v-tooltip bottom style="">
          <button slot="activator" @click="toggleExportExcel" class="modal-btn btn-icon" style="" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}">
            <i class="fa fa-file-excel-o"></i>
          </button>
          <span>Export Excel</span>
        </v-tooltip>
      </div>
      <div class="sidebar-title" v-if="file">
        <span style="font-style: italic;">{{file.filename}}</span>
          <!-- class="left-sub-sidebar-options" -->
          <div>
          <!-- class="" -->

          <v-tooltip left style="">
            <div slot="activator" class="modal-btn btn-icon dropdown-btn add-project-btn"  @click.stop="toggleOptionsDropdown"  :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid', cursor: 'pointer'}">
              <i class="fa fa-ellipsis-h" />
                <div v-click-outside="toggleOptionsDropdown"  v-if="optionsDropdown" class="basic-dropdown add-project-btn-dropdown animated-fast fadeInDown" >
                  <ul>
                    <!-- <li @click="downloadFile">Download File</li> -->
                    <!-- <li @click="toggleExportPdf">Export PDF</li> -->
                    <!-- <li @click.stop="toggleExportExcel">Export Excel</li> -->
                    <!-- <li @click="toggleReplaceFile">Replace File</li> -->
                    <li @click="toggleConfirmDelete" v-if="pems.indexOf('write')!=-1">Delete File</li>
                    <li @click.stop="toggleImageFrom" v-if="file.imageFrom=='download' && pems.indexOf('write')!=-1">Use Image From File</li>
                    <li @click.stop="toggleImageFrom" v-if="file.imageFrom=='file' && pems.indexOf('write')!=-1">Use Image From Upload</li>
                    <li @click.stop="toggleLogoFrom" v-if="file.logoFrom=='download' && pems.indexOf('write')!=-1">Use Logo From File</li>
                    <li @click.stop="toggleLogoFrom" v-if="file.logoFrom=='file' && pems.indexOf('write')!=-1">Use Logo From Upload</li>
                    <li @click="$router.push('/projects/'+projectId + '/rawfile/'+fileId)">Edit Charts</li>
                    <li @click.stop="toggleReportViaEmail">Send Report Via Email</li>
                  </ul>
                </div>
            </div>
            <span>More Actions</span>
          </v-tooltip>
        </div>
      </div>
      <div class="file-logo">
        <div v-if="file.logoFrom == 'download'" @click="toggleCropper">
          <div class="add-image" style="padding:15px">
            <i class="fa fa-camera" style=" margin-right:10px;"></i>
            Upload
          </div>
          <img :src="logoPath ? logoPath : '/static/brain.svg'" v-if="file.logo"/>
        </div>
        <div v-if="file.logoFrom == 'file'">
          <img :src="logoPath ? logoPath : '/static/brain.svg'" :style="{padding: logoPath ? '0px' : '40px'}"/>
        </div>
      </div>
      <div class="dash-nav" v-if="activeDash" @click="showSelectDash(true)">
        <span style="font-weight: bold">{{activeDash.dashName}}</span>
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
import ApiWrapper from '@/shared/utils/ApiWrapper';
import ReplaceFile from "./replace_file";
import ExportPdf from "./export_pdf";
import ToggleImageFrom from "./toggle_import_from";
import Sharing from "./toggle_import_from";

import ReportViaEmail from "./report_via_email";
import { mapGetters, mapActions } from 'vuex';
import ConfirmDelete from "../helpers/confirm_delete";
export default {
  name: "file-sidebar",
  props: ["sheets", "activate", "dashes", "activeDash", "showSelectDash", 'file', 'pems'],
  data() {
    return {
      hovered: 0,
      addProjectOpen: false,
      activeNav: 0,
      cropper: false,
      logoPath: "",
      optionsDropdown: false,
      replaceFile: false,
      exportPdf: false,
      imageSelect: false,

      exportExcel: false,
      confirmDelete: false,
      reportViaEmail: false
    };
  },
  components: {
    Cropper,
    ReplaceFile,
    ExportPdf,
    ToggleImageFrom,
    ConfirmDelete,
    ReportViaEmail,
    Sharing
  },
  mounted() {
  },
  methods: {
    ...mapActions(["getFiles"]),
    toggleExportExcel() {
      this.$emit('exportExcel');
    },
    updateFile(props) {
      this.$emit('updateFile', props);
    },
    toggleLogoFrom() {
      if (this.file.logoFrom == 'file')
        this.$emit('updateFile', {logoFrom: 'download'});
      else if (this.file.logoFrom == 'download')
        this.$emit('updateFile', {logoFrom: 'file'});
      this.optionsDropdown = false;
    },
    toggleReportViaEmail() {
      this.reportViaEmail = !this.reportViaEmail;
    },
    toggleExportPdf() {
      this.exportPdf = !this.exportPdf;
    },
    toggleConfirmDelete() {
      this.confirmDelete = !this.confirmDelete;
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
    toggleImageFileOrUpload() {
      this.imageSelect = !this.imageSelect;
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
          this.$route.params.fileId
      ).then(() => {
        this.getFiles({ project_id: this.$route.params.projectId });
        this.$router.go(-1);
        this.confirmDelete = false;
      });

    },
    downloadFile() {
      let self = this;
      ApiWrapper
        .download(
          "/api/files/download/" +
            this.$route.params.fileId,
          { responseType: "arraybuffer" },
          this.$Progress
        )
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", self.file.filename);
          document.body.appendChild(link);
          link.click();
        });
    },

    toggleImageFrom() {
      if (this.file.imageFrom == 'file')
        this.$emit('updateFile', {imageFrom: 'download'});
      else if (this.file.imageFrom == 'download')
        this.$emit('updateFile', {imageFrom: 'file'});
      this.optionsDropdown = false;
    }
  },
  computed: {
    fileId() {
      return this.$route.params.fileId;
    },
    projectId() {
      return this.$route.params.projectId;
    },
    ...mapGetters({
      user: 'user',
    }),
  },
  watch: {
    file(file) {
      if (file.logoFrom == 'file') {
        this.logoPath = file.logoFileUrl;
      } else if (file.logoFrom == 'download') {
        this.logoPath =
          "/api/static/" +
          file.user_id +
          "/" +
          file.project_id +
          "/" +
          this.$route.params.fileId +
          "_logo.jpg";
      }
    }
  },
  mounted() {
    debugger
    if (this.file.logoFrom == 'file') {
      this.logoPath = this.file.logoFileUrl;
    } else if (file.logoFrom == 'download') {
      this.logoPath =
        "/api/static/" +
        this.file.user_id +
        "/" +
        this.file.project_id +
        "/" +
        this.$route.params.fileId +
        "_logo.jpg";
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
  font-weight: 600;
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
.file-logo div.add-image {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef0f2;
}
.file-logo div.add-image:hover {
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
  align-items: center;
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
  position: relative;
  background: #f8fafb;
  border: solid 1px #4a4a4a;
  color: #808080;
  max-width: 100px;
  right: 0px;
  bottom: 0px;
  height: 34px;
}
.standard-btn.back i {
  margin-right: 10px;
}
.standard-btn.back:hover {
  background: #eff1f2;
  cursor: pointer;
}
.add-project-btn {
  border: 1px solid #4a4a4a;
  border-radius: 3px;
}
</style>
