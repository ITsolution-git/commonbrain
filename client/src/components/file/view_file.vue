<template>
  <div>
      <FileSidebar :sheets="sheets" :activate="activateSheet" />
      
      <div class="projects-container">
              <div class="tab-container">
                  <div v-for="(tab,i) in tabs" :class="{'active':(activeTab == tab)}" :key="i" @click="activateTab(i,tab)" class="tab">{{tab}}</div>
              </div>
              <div v-if="isLoading"  style="display:flex; align-items:center; justify-content:center;width:100%; height:100%;">
              <img class="spinner-big" src="../../img/spinner.svg" alt="">
              </div>
              <div v-if="!isLoading" class="main-data-container animated-fast fadeInUp">

              <div v-for="(data,i) in mainData" :key="i" class="data-container">
                  <div class="data-item">
                      <div class="data-title">{{ Object.keys(data)[0] }}</div>
                  </div>
                <div class="data-elements ">
                      <div v-for="(dat,i2) in data[Object.keys(data)[0]].data" :key="i2" class="data-item-item animated-fast fadeIn"  :class="{'left' : (dat.just != undefined && dat.just.charAt(0).toLowerCase() == 'l'), 'right' : (dat.just != undefined && dat.just.charAt(0).toLowerCase() == 'r'), 'center' : (dat.just != undefined && dat.just.charAt(0).toLowerCase() == 'c')} ">
                        <div class="data-item-title">{{dat.title}}</div>
                        <div v-if="(dat.source == undefined)" class="data-item-value animated-fast fadeInUp" v-tooltip="{ content:dat.hover  , placement:'top'}">{{dat.formatted}}</div>
                        <div v-if="(dat.source != undefined)" class="data-item-value animated-fast fadeInUp" v-tooltip="{ content:dat.hover  , placement:'top'}"><a :href="makeLink(dat.source)">{{dat.formatted}}</a></div>
                      </div>
                </div>
                 
              </div>

              </div>
          
      
      </div>
  </div>
</template>
<script>
import FileSidebar from "./file_sidebar";
import { mapActions } from "vuex";

export default {
  name: "view_file",
  data() {
    return {
      tabs: [],
      rows: [],
      mainData: {},
      activeSheet: "",
      activeTab: "",
      isLoading: true,
      activeRows: [],
      activeData: [],
      activeSubData: []
    };
  },
  methods: {
    ...mapActions(["getFile"]),

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
      for (var i = 0; i < Object.keys(this.file.rows).length; i++) {
        this.rows.push(this.file.rows[Object.keys(this.file.rows)[i]]);
      }
      this.activeSheet = this.rows[0].sheet_name;
      this.activateSheet(this.activeSheet);
      this.isLoading = false;
    },
    activateSheet(sheet) {
      var that = this;
      this.isLoading = true;
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
      this.isLoading = true;
      this.activeTab = tab;
      this.activeData = [];
      this.mainData = {};
      this.getData(tab);
    },
    getTabs(sheet) {
      this.activeData = [];
      var that = this;
      return new Promise(function(resolve, reject) {
        var tabs = [];
        for (var i = 0; i < that.rows.length; i++) {
          if (that.rows[i].sheet_name == sheet) {
            that.activeRows.push(that.rows[i]);
            if (tabs.indexOf(that.rows[i].tab_name) < 0) {
              tabs.push(that.rows[i].tab_name);
            }
          }
        }
        resolve(tabs[0]);
        that.tabs = tabs;
        //that.isLoading = false;
      });
    },
    getData(tab) {
      this.mainData = {};
      for (let i = 0; i < this.activeRows.length; i++) {
        if (this.activeRows[i].tab_name == tab) {
          // console.log(this.activeRows[i]);
          this.activeData[i] = this.activeRows[i];
          var obj = {};
          obj[this.activeData[i].major_category] = {
            title: this.activeData[i].major_category,
            data: [
              {
                title: this.activeRows[i].spec_category,
                value: this.activeRows[i].value,
                formatted: this.activeRows[i].formatted,
                hover: this.activeRows[i].hover,
                maj: this.activeRows[i].major_category,
                source: this.activeRows[i].source,
                just: this.activeRows[i].justification
              }
            ]
          };
          // console.log(this.mainData[this.activeData[i].major_category]);
          if (this.mainData[this.activeData[i].major_category] == null) {
            this.mainData[this.activeData[i].major_category] = obj;
          } else {
            this.mainData[this.activeRows[i].major_category][
              this.activeRows[i].major_category
            ]["data"].push({
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
      }
      this.isLoading = false;
      this.mainData = this.mainData;
    }
  },
  computed: {
    file() {
      return JSON.parse(JSON.stringify(this.$store.state.fileStore.file[0]));
    },
    sheets() {
      var sheetArr = [];
      for (var i = 0; i < this.rows.length; i++) {
        if (sheetArr.indexOf(this.rows[i].sheet_name) < 0) {
          sheetArr.push(this.rows[i].sheet_name);
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
      return this.$store.state.user.id;
    }
  },
  mounted() {
    this.getFile({
      userId: this.userId,
      projectId: this.projectId,
      fileId: this.fileId
    }).then(res => {
      this.getRows();
    });
  },
  components: {
    FileSidebar
  }
};
</script>
<style>
.tab-container {
  width: 100%;
  display: flex;
  align-items: center;
  padding-top: 50px;
  border-bottom: solid 1px #eaeaea;
  box-shadow: inset -9px -18px 10px -20px rgba(0, 0, 0, 0.2);
  padding-left: 15px;
  background: #f8fafb;
}
.tab {
  background: #fff;
  border-top-right-radius: 3px;
  border-top-left-radius: 3px;
  border: solid 1px #eaeaea;
  height: 50px;
  font-size: 10pt;
  padding: 10px;
  flex: 1;
  max-width: 200px;
  width: 100%;
  font-weight: 500;
  color: #ddd;
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
  border-bottom: none;
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
  margin-bottom: solid 1px #eaeaea;
  border-bottom: solid 2px #000;
}
.data-elements {
  display: flex;
  flex-wrap: wrap;
}
.data-item-item {
  display: flex;
  flex-wrap: wrap;
  min-width: 250px;
  border-bottom: solid 1px #eaeaea;
  margin: 10px;
  background: #fff;
  flex-basis: calc(50% - 30px);
  height: 30px;
}
/* .data-item-item:nth-child(odd) {
  margin-right: 15px;
} */
.data-item-title {
  font-weight: 500;
}
.data-item-value {
  margin-left: auto;
}
.data-item-value a {
  color: #00bbff;
}
.main-data-container {
  /* display: flex; */
  max-width: 1200px;
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
}
</style>
