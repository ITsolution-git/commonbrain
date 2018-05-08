<template>
  <div>
      <div v-click-outside="hideOpen" @click="toggleOpen" class="custom-select-container" :class="{'open':open}" :style="{maxWidth:width}">
          <div class="custom-select-field">{{selectedOption.label}}</div>
          <i class="fa fa-angle-down"></i>
          <div v-if="open" class="custom-select-options animated-fast fadeInDown">
              <ul>
                  <li v-for="(option, i) in options" :key="i" @click="selectOption(option)">{{option.label}}</li>
              </ul>
          </div>
      </div>
  </div>
</template>
<script>
export default {
  name: "custom_select",
  data() {
    return {
      open: false,
      options: [
        { label: "option 1", value: "option 1" },
        { label: "option 2", value: "option 2" }
      ],
      selectedOption: {},

      width: "250px"
    };
  },
  methods: {
    toggleOpen() {
      this.open = !this.open;
    },
    hideOpen() {
      this.open = false;
    },
    selectOption(option) {
      this.selectedOption = option;
    }
  }
};
</script>
<style>
.custom-select-container {
  display: flex;
  align-items: center;
  padding: 10px;
  position: relative;
  height: 40px;
  border: solid 1px #eaeaea;
  border-radius: 3px;
  background: #fff;
}
.custom-select-container.open {
  border-color: #66d0f7;
}
.custom-select-field {
  font-size: 12pt;
  color: #000;
}
.custom-select-container i {
  margin-left: auto;
  transition: all 0.3s ease;
}
.custom-select-container.open i {
  transform: rotate(180deg);
}
.custom-select-options {
  position: absolute;
  top: 40px;
  left: 0;
  width: 100%;
  overflow: auto;
  background: #fff;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  border-bottom-right-radius: 3px;
  border-bottom-left-radius: 3px;
}
.custom-select-options li {
  padding: 10px;
  font-size: 10pt;
  user-select: none;
}
.custom-select-options li:hover {
  background: #f8fafb;
  cursor: pointer;
}
</style>


