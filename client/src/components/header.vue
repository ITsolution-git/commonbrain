<template>
  <div class="top-bar">
    <div class="nav-bar">
      <div class="nav-item active">Projects</div>
      <img src="../img/brain_white.svg" alt="">
      <div class="nav-item">Templates</div>
    </div>
    <div class="user-nav">
      <div @click="toggleUserDropdown" class="nav-item"><i class="fa fa-user-circle-o"></i>
        <div v-click-outside="toggleUserDropdown" v-if="userDropdown" class="simple-dropdown animated-fast fadeInDown">
          <ul>
            <li>Sign Out</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "header_main",
  data() {
    return {
      userDropdown: false
    };
  },
  methods: {
    toggleUserDropdown() {
      this.userDropdown = !this.userDropdown;
    }
  }
};
</script>
<style>
.top-bar {
  height: 70px;
  width: 100%;
  text-align: center;
  background: #66d0f7;
  position: relative;
  z-index: 10;
}
.nav-bar {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
}
.nav-bar img {
  height: 70%;
  transition: all 0.3s ease;
  cursor: pointer;
}
.nav-bar img:hover {
  transform: scale(1.05, 1.05);
}
.nav-item {
  color: #3cb3df;
  text-shadow: 1px 1px rgba(255, 255, 255, 0.1);
  font-size: 13pt;
  margin: 0px 50px;
  text-align: center;
  font-weight: 300;
  cursor: pointer;
  position: relative;
}
.nav-item:hover {
  color: #31a6d1;
}
.nav-item.active {
  color: #fff;
  border-bottom: solid 2px #fff;
}
.user-nav {
  position: absolute;
  height: 100%;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
}
.simple-dropdown {
  position: absolute;
  background: #ffffff;
  border-radius: 3px;
  box-shadow: 1px 3px 3px rgba(0, 0, 0, 0.2);
  right: 0;
  top: 45px;
  min-width: 170px;
}
.simple-dropdown li {
  padding: 10px;
  text-align: left;
  white-space: nowrap;
}
</style>
