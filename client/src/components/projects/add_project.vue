<template>
  <div>
      <div class="overlay animated-fast" :class="{'fadeIn': !hidden,'fadeOut':hidden}">
          <div class="modal-1 animated-fast zoomIn" :class="{'zoomIn': !hidden,'zoomOut':hidden}">
              <div class="modal-top">
                  <div class="modal-title">Add Project</div>
                  <div class="modal-close"><i @click="hideThis" class="fa fa-close"></i></div>
              </div>
              <div class="modal-inner">
                  <StandardInput
                  field="Project Name"
                  name="project_name"
                  width="100%"
                  require="true"
                  />
                  <StandardSelect />
              </div>
              <div class="modal-buttons">
                  <div @click="hideThis" class="modal-btn cancel">Cancel</div>
                  <div class="modal-btn confirm">Create</div>
              </div>
          </div>
      </div>
  </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input";
import StandardSelect from "../form_elements/custom_select";
export default {
  name: "add_project",
  data() {
    return {
      hidden: false
    };
  },
  props: ["hide"],
  methods: {
    submit() {},
    hideThis() {
      var that = this;
      this.hidden = true;
      setTimeout(function() {
        that.hide();
      }, 300);
    }
  },
  components: {
    StandardInput,
    StandardSelect
  }
};
</script>
<style>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-1 {
  max-width: 500px;
  border-radius: 3px;
  overflow: hidden;
  width: 100%;
  background: #fff;
}
.modal-top {
  padding: 15px;
  display: flex;
  align-items: center;
  background: #ffffff;
  border-bottom: solid 1px #eaeaea;
}
.modal-close {
  margin-left: auto;
}
.modal-inner {
  padding: 15px;
}
.modal-buttons {
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.modal-btn {
  padding: 10px 25px;
  border-radius: 3px;
  margin-left: 10px;
  font-size: 10pt;
}
.modal-btn.cancel {
  background: #fff;
  color: #688187;
  border: solid 1px #d6dfe1;
}

.modal-btn.cancel:hover {
  cursor: pointer;
  background: #f8fafb;
}

.modal-btn.cancel:active {
  background: #eaeff2;
}
.modal-btn.confirm {
  background: #66d0f7;
  color: #fff;
}
.modal-btn.confirm:hover {
  background: #35c0f4;
  cursor: pointer;
}
.modal-btn.delete {
  background: #e35f6b;
}

.modal-btn.delete:hover {
  background: #d1535e;
}

.modal-btn.cancel {
  background: #fff;
  color: #688187;
  border: solid 1px #d6dfe1;
}

.modal-btn.cancel:hover {
  cursor: pointer;
  background: #f8fafb;
}

.modal-btn.cancel:active {
  background: #eaeff2;
}
</style>
