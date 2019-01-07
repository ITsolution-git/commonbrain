<template lang="html">
  <div class="overlay animated-fast fadeIn" >
    <div class="modal-1 animated-fast zoomIn" style="min-width: 600px" v-if="wipFile">
      <div class="modal-top">
        <div class="modal-title"> Sharing </div>
        <div v-on:click="hide" class="modal-close"><img src="../../img/close.svg"/></div>
      </div>
      <div class="modal-inner">
        <div>
          <v-layout align-center wrap v-if="wipFile">
            <v-flex xs8><strong>Anyone</strong> </v-flex>
            <v-flex xs4 pl-2>
              <select v-model="wipFile.publicPems" style="max-width: 100%;">
                <option :value="pem.value" v-for="pem in PERMISSIONS" :key="pem.value">{{pem.text}}</option>
              </select>
            </v-flex>
            <v-flex xs12 mt-3>
              Copy this link to publish.
              <div style="overflow-x: scroll; border: 1px solid #aaaaaa; padding: 5px">{{publicLink}}</div>
            </v-flex>
          </v-layout>
          <div style="margin-top: 30px"></div>
          <v-layout align-center wrap v-for="(pem,index) in wipFile.permissions" :key="index">
            <v-flex xs8>
              <v-combobox
                v-model="pem.emails"
                :items="emails"
                :hide-details="true"
                chips
                clearable
                solo
                multiple
              >
                <template slot="selection" slot-scope="data">
                  <v-chip
                    :selected="data.selected"
                    close
                    @input="remove(pem, data.item)"
                  >
                    <strong>{{ data.item }}</strong>
                  </v-chip>
                </template>
              </v-combobox>
            </v-flex>
            <v-flex xs3 pl-2>
              <select v-model="pem.pems" style="max-width: 100%;">
                <option :value="item.value" v-for="item in PERMISSIONS" :key="item.value">{{item.text}}</option>
              </select>
            </v-flex>
            <v-flex xs1>
              <div style="display: flex; justify-content: center" v-if="index == 0">
                <i class="fa fa-plus" style="font-size: 20px; cursor: pointer;" @click="addPem"></i>
              </div>
              <div style="display: flex; justify-content: center" v-if="index != 0">
                <i class="fa fa-close" style="font-size: 20px; cursor: pointer;" @click="removePem(index)"></i>
              </div>
            </v-flex>
            <v-flex
          </v-layout>  
        </div>

        <div class="modal-btn-container">
          <div @click="hide"  class="modal-btn cancel">Cancel</div>
          <div @click="save()"  class="modal-btn confirm" :style="{background: user.fillButtons? user.theme : 'transparent', color: user.fillButtons ? '#fff' : '#111111', 'border-width': '1px', 'border-color': user.showButtonBorders ? user.buttonBorder.hex : 'none', 'border-style': 'solid'}">Confirm</div>
        </div>
      </div>
    </div>
    </div>
</template>

<script>
import ApiWrapper from '@/shared/utils/ApiWrapper';
import { mapGetters, mapActions } from 'vuex';
//import auth from "../../auth";
import CONSTANTS from '@/shared/constants';

export default {
  props: ["hide", "file"],
  data() {
    return {
      PERMISSIONS: CONSTANTS.PERMISSIONS,
      wipFile: null,

      emails: []
    };
  },
  methods: {
    addPem() {
      let pems = this.wipFile.permissions;
      pems.push({emails: [], pems: 0});
      this.wipFile = {...this.wipFile, permissions:  pems};
    },
    removePem(index) {
      let pems = this.wipFile.permissions;
      pems.splice(index, 1)
      this.wipFile = {...this.wipFile, permissions: pems};
    },
    remove (pem, item) {
      pem.emails.splice(pem.emails.indexOf(item), 1);
    },
    save() {
      this.$emit('updateFile', {_id: this.wipFile._id, fields: {publicPems: this.wipFile.publicPems, permissions: this.wipFile.permissions}});
      this.toggleVisible();
    },
    toggleVisible() {
      var that = this;
      this.visible = false;
      setTimeout(function() {
        that.hide();
      }, 300);
    }
  },
  mounted() {
    this.wipFile = Object.assign({}, this.file);
    if (!this.wipFile.publicPems) {
      this.wipFile.publicPems = 0;
    }
    if (!this.wipFile.permissions) {
      this.wipFile.permissions = [{
        emails: [], pems: 0
      }]
    }
  },
  computed: {
    publicLink() {
      return `${location.protocol}//${location.host}/#/projects/${this.projectId}/${this.file._id}`;
    },
    projectId() {
      return this.$route.params.projectId;
    },
    userId() {
      return this.$store.state.user._id;
    },
    fileId() {
      return this.$route.params.fileId;
    },
    ...mapGetters({
      user: 'user',
    }),
  }
};
</script>
<style>
.hide {
  opacity: 0;
  pointer-events: none;
  position: absolute;
}
</style>
