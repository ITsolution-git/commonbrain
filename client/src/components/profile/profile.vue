<template>
  <div>
    <Cropper :upload="toggleCropper"  :hide="toggleCropper" v-if="cropper" imgType="profile"></Cropper>
    <Sidebar :activeNav="activeNav" @activateNav="activateNav"/>
    <div class="profile-container profile-img-back" v-if="activeNav == 0" >
      <div class="main-title">User Profile</div>
      <v-layout>
        <v-flex xs6>
          <div  class="profile-image">
            <div @mouseover="imageHover" @mouseout="imageHover" class="profile-image-image">
              <div v-if="imageHovered" class="image-overlay animated-fast fadeIn" @click="toggleCropper"><span class="animated-fast fadeInDown"><i class="fa fa-camera"></i> Change</span></div>

              <img style="width:100%;" :src="user.image ?  ('/api/static/' + user._id + '/' +user._id + '.jpg') : emptyProfile" />
            </div>
            <div class="profile-image-title">Profile Image</div>
          </div>
        </v-flex>
        <v-flex xs6>
          <div class="profile-details">
            <div class="profile-detail-item">
              <div class="profile-detail-title">Name</div>
              <div class="profile-detail-value">{{user.username}}</div>
              <div class="profile-detail-change-btn"><i class="fa fa-pencil"></i></div>
            </div>
            <div class="profile-detail-item">
              <div class="profile-detail-title">Email</div>
              <div class="profile-detail-value">{{user.email}}</div>
              <div class="profile-detail-change-btn"><i class="fa fa-pencil"></i></div>
            </div>
          </div>
        </v-flex>
      </v-layout>
    </div>
    <div class="profile-container profile-img-back" v-if="activeNav == 1">
      <div class="main-title">Settings</div>
      <div class="setting-top-row" v-if="wipUser">
        <div class="pa-2">
          <v-flex style="display: flex" xs12 align-center justify-space-around>
            <div style="width: 30%; border: 1px solid #c0c1c2;"></div>
            General
            <div style="width: 30%; border: 1px solid #c0c1c2;"></div>
          </v-flex>
          <v-flex style="display: flex" xs6 align-center flex-row flex pa-3>
            <v-flex xs12 sm6> <span>Theme</span></v-flex>
            <v-flex xs12 sm6 d-flex align-center>
              <select v-model="wipUser.theme">
                <option :value="theme.value" v-for="theme in themes" :key="theme.value">{{theme.text}}</option>
              </select>
            </v-flex>
          </v-flex>

          <v-flex style="display: flex" xs6 >
          </v-flex>


          <v-flex style="display: flex" xs12 align-center justify-space-around>
            <div style="width: 30%; border: 1px solid #c0c1c2;"></div>
            Export
            <div style="width: 30%; border: 1px solid #c0c1c2;"></div>
          </v-flex>
          <v-flex style="display: flex" xs6 align-center flex-row flex pa-3>
            <v-flex xs12 sm6> <span>Show Hover comments as a Tool Tip on Export</span></v-flex>
            <v-flex xs12 sm6 d-flex align-center>
              <select v-model="wipUser.showHoverOnExport">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </v-flex>
          </v-flex>
          <v-flex style="display: flex" xs6 align-center flex-row flex pa-3>
            <v-flex xs12 sm6> <span>Show HyperLinks?</span></v-flex>
            <v-flex xs12 sm6 d-flex align-center>
              <select v-model="wipUser.showHyperlink">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </v-flex>
          </v-flex>

          


          <v-flex style="display: flex" xs12 align-center justify-space-around>
            <div style="width: 30%; border: 1px solid #c0c1c2;"></div>
            Customization
            <div style="width: 30%; border: 1px solid #c0c1c2;"></div>
          </v-flex>
          <v-flex style="display: flex" xs6 align-center flex-row flex pa-3>
            <v-flex xs12 sm6> <span>You want borders on buttons?</span></v-flex>
            <v-flex xs12 sm6 d-flex align-center>
              <select v-model="wipUser.showButtonBorders">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </v-flex>
          </v-flex>
          <v-flex style="display: flex" xs6 align-center flex-row flex pa-3>
            <v-flex xs12 sm6> <span>Do you want buttons to be transparent?</span></v-flex>
            <v-flex xs12 sm6 d-flex align-center>
              <select v-model="wipUser.fillButtons">
                <option :value="true">Yes</option>
                <option :value="false">No</option>
              </select>
            </v-flex>
          </v-flex>
          <v-flex style="display: flex" xs6 align-center flex-row flex pa-3>
            <v-flex xs12 sm6> <span>Border Color</span></v-flex>
            <v-flex xs12 sm6 d-flex align-center style="position: relative;">
              <div style="display: flex; justify-content: center; align-items: center" :style="{'background-color': wipUser.buttonBorder.hex}" @click="showPicker=true">
                {{wipUser.buttonBorder.hex}}
              </div>
              <photoshop v-model="wipUser.buttonBorder" style="position: absolute;" @ok="showPicker=false" @@cancel="showPicker=false" v-if="showPicker"/>
            </v-flex>
          </v-flex>
        </div>
        <div style="text-align: right; margin-right: 10px">
          <button @click="save()" class="modal-btn" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}">
            Save
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import Sidebar from "./sidebar";
import { mapGetters, mapActions } from 'vuex';
import ApiWrapper from '@/shared/utils/ApiWrapper';
import { Photoshop } from 'vue-color'
import Cropper from "../file/cropper";
import emptyProfile from "../../img/empty_profile.png"
export default {
  name: "profile",
  data() {
    return {
      emptyProfile: emptyProfile,
      imageHovered: false,
      activeNav: 0,
      themes: [{
        value: '#FF0000',
        text: 'Red',
      },{
        value: '#f96c48',
        text: 'Orange',
      },{
        value: '#FFFF00',
        text: 'Yellow',
      },{
        value: '#228B22',
        text: 'Green',
      },{
        value: '#66d0f7',
        text: 'Blue',
      },{
        value: '#4B0082',
        text: 'Indigo',
      },{
        value: '#9400D3',
        text: 'Violet',
      }],

      wipUser: null,
      showPicker: false,

      cropper: false
    };
  },
  watch: {
    user (newVal) {
      console.log(newVal);
    },
  },
  components: {
    Cropper,
    Sidebar,
    Photoshop
  },
  mounted() {
    this.wipUser = Object.assign({ theme: '#66d0f7', showHoverOnExport: false, buttonBorder: {hex: '#000000'}, showButtonBorders: true, fillButtons: true, showHyperlink: true},  this.$store.state.user);
  },
  methods: {
    activateNav(nav) {
      this.activeNav = nav;
    },
    imageHover() {
      this.imageHovered = !this.imageHovered;
    },

    save() {
      this.$store.dispatch('updateUser', this.wipUser);
    },
    toggleCropper: function() {
      this.cropper = !this.cropper;
    },
  },
  computed: {
    ...mapGetters({
      user: 'user',
    }),
  }
};
</script>
<style>
.profile-img-back {
  height: 100%;
  background-image: url(/static/img/neural_net2.cd0ef2b.jpg); 
  background-size: cover;
  background-position: center;
}
.profile-top-row {
}
.setting-top-row {
}
.profile-image {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.profile-image-image {
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  box-shadow: 1px 21px 34px -12px rgba(0, 0, 0, 0.6);
  max-height: 200px;
  max-width: 200px;
  border-radius: 300px;
}
.profile-image-title {
  font-size: 12pt;
  font-weight: 500;
  margin-top: 10px;
}
.profile-details {
  display: flex;
  flex-direction: column;
  width: 300px;
  align-items: start;
}
.image-overlay {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.image-overlay span {
  border: solid 1px #808080;
  border-radius: 3px;
  padding: 7px 10px;
}
.profile-detail-item {
  width: 100%;
  position: relative;
  padding: 10px;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: start;
  border: solid 1px transparent;
  transition: all 0.2s ease;
}
.profile-detail-item:hover {
  background: #fff;
  border: solid 1px #eaeaea;
  border-radius: 3px;
}
.profile-detail-change-btn {
  opacity: 0;
  pointer-events: none;
  position: absolute;
  display: flex;
  align-items: center;
  right: 0;
  top: 0;
  margin-right: 15px;
  height: 100%;
  transition: all 0.2s ease;
}
.profile-detail-change-btn i {
  color: #d0d0d0;
  border: solid 1px #eaeaea;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px;
  width: 35px;
  font-size: 10pt;
}
.profile-detail-item:hover .profile-detail-change-btn {
  opacity: 1;
  pointer-events: unset;
}
.profile-detail-item:hover .profile-detail-title {
  color: #66d0f7;
}
.profile-other {
}
.profile-detail-title {
  font-weight: 500;
  transition: all 0.2s ease;
}
.profile-detail-value {
  font-weight: 300;
}
</style>
