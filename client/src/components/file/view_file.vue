<template>
  <div>
    
    <Cropper :upload="toggleCropper"  :hide="toggleCropper" v-if="cropper" imgType="image"></Cropper>

    <div v-if="isLoading"  style="display:flex; align-items:center; justify-content:center;width:100%; height:100%;">
      <img class="spinner-big" src="../../img/spinner.svg" alt="">
    </div>
    <div v-if="pems.indexOf('read')!=-1 && !isLoading">

      <FileSidebar :sheets="sheets" :activate="activateSheet" :dashes="dashes" :showSelectDash="showSelectDash" :activeDash="activeDash" :file="file" @updateFile="updateFile" @exportExcel="exportExcel" :pems="pems" :activeSheet="activeSheet" :selectDashScreen="selectDashScreen" :loadFile="loadFile"/>
      <div class="projects-container" v-if="selectDashScreen" style="padding: 30px;overflow-y: auto;">
        <div>
          <StandardInput
            :field="'Serach ' + dashItemNameLabel"
            v-model="searchEntityKey"
            width="100%"
            :placeholder="dashItemNameLabel+'...'"
          />
        </div>
        <table class="standard-table">
          <tbody>
            <tr><th>{{dashItemNameLabel}}</th><th>Name2</th><th>Status</th><th>Geography</th><th>Other</th></tr>
            <tr v-for="(dash,i)  in filteredDashes" :key="i">
              <td @click="activateDash(dash)">
                <div  class="project-name">
                  <i class="fa fa-building-o"></i> 
                  <span>{{dash.dashName}}</span>
                </div>
              </td>
              <td><span>{{dash.name2}}</span></td>
              <td><span>{{dash.status}}</span></td>
              <td><span>{{dash.geography}}</span></td>
              <td><span>{{dash.other}}</span></td>
            </tr>
            <tr v-if="filteredDashes.length == 0">
              <td style="text-align: center" colspan="6">None</td>
            </tr>
            
          </tbody>
        </table>
      </div>

      <div class="projects-container" v-else>
        <div class="breadcrumbs-cont" :style="{'border': '1px solid ' + user.buttonBorder.hex}">
          <a class="breadcrumbs-item" @click="$router.push('/projects/' + projectId)" style="color: #66d0f7">Project: {{project.project_name}}</a><span>/</span>
          <div class="breadcrumbs-item">File: {{file.name}}</div><span>/</span>
          <div class="breadcrumbs-item" v-if="activeDash">Dash: {{activeDash.dashName}}</div><span  v-if="activeDash">/</span>
          <div class="breadcrumbs-item">Sheet: {{activeSheet}}</div>
        </div>
        <div class="top-toolbar">
          <StandardInput
            v-model="searchMainDataKey"
            placeholder="Search..."
          />

          <div style="margin: 0px 10px; text-align: end; display: flex">
            <button @click="toggleCollapseAll" class="modal-btn btn-white" style="width: 120px" type="submit" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}">
              {{collapseStatus  == 'collapse' ? 'Expand All' : 'Collapse All'}}
            </button>

            <v-tooltip bottom style="">
              <button slot="activator" style="padding: 7px 10px" @click="rootImgBoxStatus = (rootImgBoxStatus=='show' ? 'hide' : 'show')" class="modal-btn btn-icon" :class="{'btn-icon-toggled': rootImgBoxStatus=='hide'}" type="submit" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}">
                <i class="fa fa-image"></i>
              </button>
              <span>Images</span>
            </v-tooltip>
          </div>
        </div>

        <!-- <div class="file-logo">
          <div v-if="file.imageFrom == 'download'" @click="toggleCropper">
            <div class="add-image" style="padding:15px">
              <i class="fa fa-camera" style=" margin-right:10px;"></i>
              Upload
            </div>
            <img :src="imagePath" v-if="file.image" style="height: 200px; margin: 0 auto; width: auto"/>
          </div>

          <div v-if="file.imageFrom == 'file'">
            <img :src="imagePath" v-if="imagePath" style="height: 200px; margin: 0 auto; width: auto"/>
          </div>
        </div>
         -->
        <div class="root-images-container" :class="{'root-images-container-opened': rootImgBoxStatus=='hide'}" v-if="dashRootImges && dashRootImges.length > 0">
          <div class="root-images">
            <div class="root-image-item" v-viewer="{title: (image, imageData) => { return dashRootImges[index].desc ? dashRootImges[index].desc : '';},}">
              <img :src="img.link" @mouseover="mouseHoverImage($event, index)" @mouseleave="mouseLeaveImage($event, index)" ref="rootImageEl"  v-for="(img,index) in dashRootImges" :key="index" />
            </div>
          </div>

          <div class="root-image-close-btn">
            <i class="fa fa-close" @click="rootImgBoxStatus='hide'"></i>
          </div>
        </div>
        <div class="tab-container" :style="{'border-bottom': '1px solid ' + user.buttonBorder.hex}">
          <div v-for="(tab,i) in tabs" :class="{'active':(activeTab == tab), 'tab-name': true}" :key="i" @click="activateTab(i,tab)" class="tab" :style="{'border': '1px solid ' + user.buttonBorder.hex}">{{tab}}</div>
        </div>
        <div class="main-data-container animated-fast fadeInUp">
          <div v-for="(data,i) in filteredMainData" :key="i" class="data-container">
            
            <div class="data-item" @click="toggleDropdown(i)" :style="{'border-bottom': '1px solid ' + user.buttonBorder.hex}">
              <div style="display: flex; flex-direction: row; align-items: center">
                <i class="fa fa-minus" v-if="data.show"></i>
                <i class="fa fa-plus" v-if="!data.show"></i>
                <div class="data-title" v-html="formatWithSearch(data.title)"></div>
              </div>
              <div class="major-images">
                <div class="major-image-item"  :v-viewer="{title: (image, imageData) => { return data.images[index].desc ? data.images[index].desc : '';},}" v-for="(img,index) in data.images" :key="index">
                  <img :src="img.link" />
                </div>
              </div>
            </div>
            <div class="data-elements" v-if="data.show"  :style="{'background': ((data.images && data.images.length > 0 && data.images[0].position && data.images[0].position.charAt(0).toLowerCase() == 's') ? ('url('+ data.images[0].link + ')  no-repeat center center fixed') : 'transparent')}">
              <div class="major-images" v-if="data.images && data.images.length > 0 && data.images[0].position && data.images[0].position.charAt(0).toLowerCase() == 't'">
                <div class="major-image-item"   v-viewer="{title: (image, imageData) => { return data.images[index].desc ? data.images[index].desc : '';},}">
                  <img :src="img.link"  style="height: 100px" v-for="(img,index) in data.images" :key="index"/>
                </div>
              </div>
              <div v-for="(dat,i2) in data.data" :key="i2" class="data-item-item animated-fast fadeIn"  :class="{'left' : (dat.just != undefined && dat.just.charAt(0).toLowerCase() == 'l'), 'right' : (dat.just != undefined && dat.just.charAt(0).toLowerCase() == 'r'), 'center' : (dat.just != undefined && dat.just.charAt(0).toLowerCase() == 'c')}">
                <div class="data-item-title"  v-html="formatWithSearch(dat.title)"></div>
                <div v-if="(!dat.source)" class="data-item-value animated-fast fadeInUp" v-tooltip="{ content:dat.hover  , placement:'top'}"  v-html="formatWithSearch(dat.formatted)"></div>
                <div v-if="(dat.source)" class="data-item-value animated-fast fadeInUp" v-tooltip="{ content:dat.hover  , placement:'top'}"><a :href="makeLink(dat.source)"  v-html="formatWithSearch(dat.formatted)" target="_blank"></a></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
    <NotFound v-if="pems.indexOf('read')==-1 && !isLoading" />
  </div>
</template>
<script>
import Cropper from "./cropper";
import FileSidebar from "./file_sidebar";
import { mapGetters, mapActions } from 'vuex';
import StandardInput from "../form_elements/standard_input";
import moment from 'moment';
import ApiWrapper from '@/shared/utils/ApiWrapper';
import CONSTANTS from '@/shared/constants';
import NotFound from "@/components/shared/NotFound";

var _ = require('lodash');

export default {
  name: "view_file",
  data() {
    return {
      dashes: [],
      tabs: [],
      rows: [],
      dashRows: [],
      mainData: {},

      activeSheet: "",
      activeTab: "",
      activeDash: "",

      isLoading: true,
      activeRows: [],
      activeData: [],
      activeSubData: [],

      selectDashScreen: false,

      searchEntityKey: "",
      searchMainDataKey: "",

      collapseStatus: 'collapse',
      imagePath: '',
      cropper: false,

      dashImages: [],
      dashRootImges: [],
      rootImgBoxStatus: 'show',

      dashItemNameLabel: 'Asset Name',
      pems: [],
      CONSTANTS: CONSTANTS
    };
  },
  watch: {
    searchMainDataKey(val) {
      this.toggleCollapseAll(true);
    }
  },
  methods: {
    ...mapActions(["getFile"]),
    mouseHoverImage(event, index) {
      clearTimeout(this.imgTimer);
      this.imgTimer = setTimeout(()=>{
        this.$refs.rootImageEl[index].click();
      }, 200)
      
    },
    mouseLeaveImage(event) {
      clearTimeout(this.imgTimer);
    },
    exportExcel() {

      ApiWrapper
        .download(
          "/api/files/report/excel/" +
            this.$route.params.fileId,
          { responseType: "arraybuffer" },
          this.$Progress
        )
        .then(res => {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", this.file.name + '_' + moment().format('YYYY-MM-DD HH:mm') + '.xlsx');
          document.body.appendChild(link);
          link.click();
        });

      // let html = this.generateReportTable();

      // var table = document.createElement('div');
      // table.innerHTML = html;
      // table = table.firstChild;
      // var ws = XLSX.utils.table_to_sheet(table);
      // var wb = XLSX.utils.book_new();
      // var wscols = [
      //   {},
      //   {wch: 230},
      //   {},
      //   {},
      //   {},
      //   {},
      // ];
      // ws['!cols'] = wscols;

      // XLSX.utils.book_append_sheet(wb, ws, 'CommonBrain');

      // XLSX.writeFile(wb, this.file.name+'-Report.xlsx');
    },
    getRenderData() {

      let dashes = this.dashes.length == 0 ? [undefined] : this.dashes;
      
      let self = this;
      let renderData = dashes.map(dash=>{
        let dashRows = self.rows.filter(row=>row.dash_name == dash.dashName);
        let sheets = [];
        let sheetRows = _.groupBy(dashRows, 'sheet_name');

        for (let sheetkey in sheetRows) {
          let tabRows = _.groupBy(sheetRows[sheetkey], 'tab_name');
          let tabs = [];
          for (let tabkey in tabRows) {
            let majorCatRows = _.groupBy(tabRows[tabkey], 'major_category');
            let majorCats = [];
            for (let catkey in majorCatRows) {
              majorCats.push({name: catkey, data: majorCatRows[catkey]});
            }
            tabs.push({name: tabkey, data: majorCats});
          }
          sheets.push({name: sheetkey, data: tabs});
        }

        return {
          dash: dash,
          data: sheets
        }
      })
      return renderData;
    },
    generateReportTable() {
      let html = `<table><tr><td colspan=9>${this.file.title}</td></tr>`;
      let renderData = this.getRenderData();
      renderData.map(dash=>{
        html+=`<tr><td>${dash.dash.dashName} - ${dash.dash.name2}</td></tr>`;  
        dash.data.map(sheet=>{
          let add = '<td style="color: red"></td>';
          html+=`<tr>${add}<td>${sheet.name}</td></tr>`;  
          sheet.data.map(tab=>{

            let add = '<td></td><td></td>';
            html+=`<tr>${add}<td>${tab.name}</td></tr>`;  
            tab.data.map(majcat=>{

              let add = '<td></td><td></td><td></td>';
              html+=`<tr>${add}<td>${majcat.name}</td></tr>`;  

              for (let i = 0; i < majcat.data.length; i+=2) {
                let add = '<td></td><td></td><td></td><td></td>';

                if (i+1 < majcat.data.length) {
                  html+=`<tr>${add}<td>${majcat.data[i].spec_category}</td><td>${majcat.data[i].formatted}</td><td></td><td>${majcat.data[i+1].spec_category}</td><td>${majcat.data[i+1].formatted}</td></tr>`;  
                } else {
                  html+=`<tr>${add}<td>${majcat.data[i].spec_category}</td><td>${majcat.data[i].formatted}</td></tr>`;  
                }
              }
            })
          })
        })
      })
      return html + '</table>';
    },
    updateFile(fields) {

      ApiWrapper  
        .put(
          "/api/files/update/" +
            this.fileId,
          fields
        )
        .then(res => {
          this.loadFile();
        });

    },
    round(data) {
      if (typeof data == "number") {
        return Math.round(data);
      } else {
        return data;
      }
    },
    makeLink(link) {
      if (link.indexOf("http") < 0) {
        return "http://" + link;
      } else {
        return link;
      }
    },
    numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    format(value) {
      if (typeof value == "number") {
        return this.numberWithCommas(value);
      } else {
        return value;
      }
    },
    getRows() {
      this.dashItemNameLabel = this.file.dashItemNameLabel ? this.file.dashItemNameLabel : 'Asset Name';
      if (this.file.dashes) {
        for (let key in this.file.dashes) {
          this.dashes.push(this.file.dashes[key]);
        }
      }

      for (var i = 0; i < Object.keys(this.file.rows).length; i++) {
        this.rows.push(this.file.rows[Object.keys(this.file.rows)[i]]);
      }

      if (this.dashes.length > 0) {
        this.activateDash(this.dashes[0]);
        this.showSelectDash(true);
      } else {
        this.dashRows = this.rows;
        this.dashImages = this.file.majorImages ? this.file.majorImages : [];  //Load all major images to this dashitem
        if (this.dashRows.length > 0) {
          this.activeSheet = this.dashRows[0].sheet_name;
          this.activateSheet(this.activeSheet);
        }
      }
    },
    activateDash(dash) {
      this.activeDash = dash;
      this.dashRows = this.rows.filter(row=>row.dash_name == dash.dashName);
      if (this.dashRows.length > 0) {
        this.activeSheet = this.dashRows[0].sheet_name;
        this.activateSheet(this.activeSheet);

        this.dashImages = this.file.majorImages.filter(row=>row.dashItem == dash.dashName);
        this.dashRootImges = this.file.rootImages.filter(row=>row.dashItem == dash.dashName);;
      } else {
        this.dashRootImges = this.file.rootImages;
        this.activeSheet = "";
        this.activeRows = [];
        this.activeData = [];
        this.tabs = [];
        this.mainData = [];
      }
      this.showSelectDash(false);
    },
    activateSheet(sheet) {
      var that = this;
      // this.isLoading = true;
      setTimeout(function() {
        that.activeSheet = sheet;
        that.activeRows = [];
        that.activeData = [];
        that.getTabs(sheet).then(res => {
          that.activeTab = res;
          that.getData(res);
        });
      }, 10);
    },
    activateTab(i, tab) {
      // this.isLoading = true;
      this.activeTab = tab;
      this.activeData = [];
      this.mainData = {};
      this.getData(tab);
    },
    showSelectDash (val) {
      this.selectDashScreen = val;
    },
    getTabs(sheet) {
      this.activeData = [];
      var that = this;
      return new Promise(function(resolve, reject) {
        var tabs = [];
        for (var i = 0; i < that.dashRows.length; i++) {
          if (that.dashRows[i].sheet_name == sheet) {
            that.activeRows.push(that.dashRows[i]);
            if (tabs.indexOf(that.dashRows[i].tab_name) < 0) {
              tabs.push(that.dashRows[i].tab_name);
            }
          }
        }
        resolve(tabs[0]);
        that.tabs = tabs;
        //that.isLoading = false;
      });
    },
    getData(tab) {
      this.mainData = [];
      let mainData = {};
      let seq = 0; //set sequence
      for (let i = 0; i < this.activeRows.length; i++) {
        if (this.activeRows[i].tab_name == tab) {
          
          this.activeData[i] = this.activeRows[i];
          let majorCat = this.activeData[i].major_category
          var obj = {};
          if (!mainData[majorCat]) {
            mainData[majorCat] = {
              title: majorCat,
              data: [],
              images: this.dashImages.filter(img=>{
                return ((img.sheetName == this.activeSheet) && (img.tabName == tab) && (img.majorCategory == majorCat))
              }),
              seq: seq
            };
            seq ++;
          }

          mainData[majorCat].data.push({
            title: this.activeRows[i].spec_category,
            value: this.activeRows[i].value,
            formatted: this.activeRows[i].formatted,
            hover: this.activeRows[i].hover,
            maj: this.activeRows[i].major_category,
            source: this.activeRows[i].source,
            just: this.activeRows[i].justification
          });

        }
      }
      this.isLoading = false;
      // this.mainData = mainData;
      for(let key in mainData) {
        this.mainData.push({
          title: mainData[key].title,
          data: this.sortDataByJust(mainData[key].data),
          images: mainData[key].images,
          seq: mainData[key].seq,
        });
      }


      //sort by seq
      this.mainData = this.mainData.sort((s1, s2)=>s1.seq-s2.seq);

    },

    //sorting by just
    sortDataByJust(data) {
      let target = [];
      while(data.length > 0) {
        let item = data.splice(0,1)[0];
        if (item.just && item.just.charAt(0).toLowerCase() == 'r') {
          let lastel = target[target.length - 1];
          if (lastel && (
            !lastel.just || (lastel.just && lastel.just.charAt(0).toLowerCase() == 'l'))) { // if prev is left

            target[target.length - 1].just = '';
            target.push({...item, just: ''});
          } else {
            target.push(item);
          }
        } else {
          target.push(item);
        }
        //   let len = target.length;
        //   if (len % 2 == 0) { //find left
        //     for (var i = 0; i < data.length; i++) {
        //       data[i]
        //     }
        //   }
        // } else {
        //   target.push(data.unshift());
        // }
        
      }
      return target;
    },
    toggleDropdown (i) {
      this.mainData = this.mainData.map((item, index)=>{
        if (index == i)
          return {
            ...item,
            show: !item.show
          };
        else return item;
      });
      if (this.mainData.map(item=>item.show).indexOf(true) == -1)
        this.collapseStatus = 'collapse';
      else
        this.collapseStatus = 'expand';
    },

    toggleCollapseAll(force) {
      let toToggle = true;
      if (typeof force == 'boolean')
        toToggle = force;
      else {
        this.mainData.map((item, index)=>{
          if (item.show)
            toToggle = false;
        });
      }

      this.mainData = this.mainData.map((item, index)=>{
        
        return {
          ...item,
          show: toToggle
        };
      });
      if (this.mainData.map(item=>item.show).indexOf(true) == -1)
        this.collapseStatus = 'collapse';
      else
        this.collapseStatus = 'expand';
    },
    formatWithSearch(str) {
      if (!this.searchMainDataKey)
        return str;
      else {
        let match = new RegExp("(" + this.searchMainDataKey + ")","gi"); 
        return str.replace(match, "<span style='background-color: #FFFF00'>$1</span>")
      }
    },
    loadFile() {
      this.dashes = [];
      this.tabs = [];
      this.rows = [];
      this.dashRows = [];
      
      this.getFile({
        fileId: this.fileId
      }).then(res => {
        let resultPems = [];

        let publicPemObj = CONSTANTS.PERMISSIONS[this.file.publicPems];
        let publicPems = publicPemObj ? publicPemObj.pems : [];

        resultPems = publicPems;

        if (this.user._id && this.file.permissions) { // logged in
          this.file.permissions.map(permission => {
            permission.emails.map(email=>{
              if (email.toLowerCase() == this.user.email.toLowerCase()) {
                let pemObj = CONSTANTS.PERMISSIONS[permission.pems];
                if (Array.isArray(pemObj.pems)) {
                  pemObj.pems.map(p => {
                    if(resultPems.indexOf(p) == -1) {
                      resultPems.push(p);
                    }
                  });
                }
              }
            });
          });
        }

        if (this.user._id == this.file.user_id) { // owner
          resultPems = ['read', 'download', 'write']; //full permission
        }
        
        this.pems = resultPems;

        this.isLoading = false;
        console.log(resultPems);

        this.getRows();

        if (this.file.imageFrom == 'file') {
          this.imagePath = this.file.imageFileUrl;
        } else if (this.file.imageFrom == 'download') {
          this.imagePath =
            "/api/static/" +
            this.$store.state.user._id +
            "/" +
            this.$route.params.projectId +
            "/" +
            this.$route.params.fileId +
            "_image.jpg";
        }
      });
    },
    toggleCropper() {
      this.cropper = !this.cropper;
    },
  },
  computed: {
    file() {
      return this.$store.state.fileStore.file[0] ? Object.assign({}, this.$store.state.fileStore.file[0]) : {}; 
    },
    project() {
      return (this.$store.state.fileStore.project && this.$store.state.fileStore.project[0]) ? Object.assign({}, this.$store.state.fileStore.project[0]) : {}; 
    },

    sheets() {
      var sheetArr = [];
      for (var i = 0; i < this.dashRows.length; i++) {
        if (sheetArr.indexOf(this.dashRows[i].sheet_name) < 0) {
          sheetArr.push(this.dashRows[i].sheet_name);
        }
      }
      return sheetArr;
    },
    fileId() {
      return this.$route.params.fileId;
    },
    projectId() {
      return this.$route.params.projectId;
    },
    userId() {
      return this.$store.state.user._id ? this.$store.state.user._id : 0;
    },

    filteredDashes() {
      if (!this.searchEntityKey)
        return this.dashes;
      return this.dashes.filter(dash=>{
        let str = dash.dashName + ' ' + dash.name2 + ' ' + dash.status + ' ' + dash.geography + ' ' + dash.other;
        if (str.toLowerCase().indexOf(this.searchEntityKey.toLowerCase()) != -1)
          return true;
        return false;
      })
    },
    filteredMainData() {
      return this.mainData;
      //Removed for now to show all search result, and just highlights
      if (!this.searchMainDataKey)
        return this.mainData;

      let that = this;
      return this.mainData.map(item=>{
        if (item.title.toLowerCase().indexOf(that.searchMainDataKey.toLowerCase()) != -1)
          return item;
        return {
          ...item,
          data: item.data.filter(dat=>{

            let str = dat.formatted + ' ' + dat.title + ' ' + dat.hover;
            if (str.toLowerCase().indexOf(that.searchMainDataKey.toLowerCase()) != -1)
              return true;
            return false;   
          })
        }
      })
    },
    ...mapGetters({
      user: 'user',
    }),
  },
  mounted() {
    this.loadFile()
  },
  components: {
    FileSidebar,
    StandardInput,
    Cropper,
    NotFound
  }
};
</script>
<style lang="scss">
.tab-container {
  width: 100%;
  display: flex;
  align-items: center;
  padding-top: 10px;
  box-shadow: inset -9px -18px 10px -20px rgba(0, 0, 0, 0.2);
  padding-left: 15px;
  background: #f8fafb;
}

.tab-name {
  font-size: 17px !important;
  font-weight: 600 !important;
}
.tab {
  background: #fff;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  height: 50px;
  font-size: 10pt;
  padding: 10px;
  flex: 1;
  max-width: 200px;
  width: 100%;
  font-weight: 500;
  color: #2a2a2a;
  display: flex;
  align-items: center;
  justify-content: center;

  box-shadow: 0px -5px 8px -5px rgba(0, 0, 0, 0.1);
  margin-right: 5px;
  margin-bottom: -1px;
}
.tab:hover {
  cursor: pointer;
  color: #000;
}
.tab.active {
  color: #66d0f7;
  border-bottom: none !important;
}
.data-container {
  padding: 15px;
  width: 100%;
  flex-basis: 50%;
  min-width: 500px;
  flex-grow: 1;
}
.data-title {
  font-size: 15pt;
  color: #000;
  margin-left: 20px;
}
.data-elements {
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover !important;
}


.data-item {
  flex-direction: row;
  display: flex;
  width: 100%;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;
}
.data-item-item {
  display: flex;
  flex-wrap: wrap;
  min-width: 250px;
  margin: 10px;
  background: transparent;
  flex-basis: calc(50% - 30px);
  min-height: 30px;
  font-size: 15px;
}
/* .data-item-item:nth-child(odd) {
  margin-right: 15px;
} */
.data-item-title {
  font-weight: 500;
}
.data-item-value {
  margin-left: auto;
  color: #000000;
  font-weight: 500;
}
.data-item-value a {
  color: #2163c1;
}
.main-data-container {
  /* display: flex; */
  /*max-width: 1200px;*/
  flex-wrap: wrap;
  margin-top: 25px;
  height: calc(100vh - 180px);
  overflow: auto;
}
.data-container {
}
.left {
  margin-right: 50%;
}
.right {
  margin-left: 50%;
}
.center {
  flex: auto;
  width: 100%;
  padding: 0px 25%;
}
.center .data-item-title {

}
.top-toolbar {
  margin: 10px;

  flex-direction: row;
  display: flex;
  justify-content: space-between;
  align-items: center
}
.root-images-container {
  display: flex;
  /*transition: all 0.1s ease-out;*/
  flex-direction: row;
  width: 100%;
  &.root-images-container-opened {
    height: 0px;
    width: 0px;
    margin-left: -100px;
  }
  .root-images {
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 100%;
    overflow-x: auto;
    flex-wrap: wrap;
  }
  .root-images img {
    height: 150px;
    padding: 5px;
  }
  .root-image-close-btn {
    margin: 10px;
    width: 30px;
    height: 30px;
    background: #00000080;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    font-size: 15px;
    i:hover {
      color: #4a4a4a;
    }
  }
}



.major-images {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  overflow-x: auto;
}
.major-images img {
  height: 30px;
}

.breadcrumbs-cont {
  display: flex;
  align-items: center;
  padding: 5px;
  margin: 5px 12px;
  margin-top: 10px;
  background: #fff;
  border: 1px solid #4a4a4a;
  border-radius: 2px;

  .breadcrumbs-item {
    padding-left: 5px;
    padding-right: 5px;
    font-weight: bold;
  }
}
</style>
