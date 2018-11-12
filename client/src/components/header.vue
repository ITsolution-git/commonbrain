<template>
  <div class="top-bar" :style="{'background': user.theme}">
    <div :class="'nav-bar nav-bar-' + user.theme">
      <div @click="$router.push('/projects')" :class="{'nav-item': true, active: currentPath.indexOf('projects')!=-1}" :style="{'color': '#fff'}">Projects</div>
      <img @click="$router.push('/templates')" src="../img/brain_white.svg" alt="" >
      <div @click="$router.push('/ofac')" :class="{'nav-item': true, active: currentPath.indexOf('ofac')!=-1}" :style="{'color': '#fff'}">OFAC</div>
      <!-- <div @click="$router.push('/templates')" :class="{'nav-item': true, active: currentPath.indexOf('templates')!=-1}">Templates</div> -->
    </div>
    <div class="user-nav">
      <div @click="toggleUserDropdown" :class="'nav-item nav-item-' + user.theme"><i class="fa fa-user-circle-o"></i>
        <div v-click-outside="toggleUserDropdown" v-if="userDropdown" class="simple-dropdown animated-fast fadeInDown">
          <ul>
            <li @click="$router.push('/profile')">Profile</li>
            <li @click="logout">Sign Out</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import auth from "../auth";
import { mapMutations } from "vuex";
import { mapGetters, mapActions } from 'vuex';
export default {
  name: "header_main",
  data() {
    return {
      userDropdown: false,
      currentPath: window.location.href,
    };
  },
  computed: {
    ...mapGetters({
      user: 'user',
    }),

  },
  watch:{
    $route (to, from){
      this.currentPath = to.path;
    }
  }, 
  methods: {
    ...mapMutations("projects", ["resetState"]),
    toggleUserDropdown() {
      this.userDropdown = !this.userDropdown;
    },
    logout() {
      this.resetState();
      auth.logout();
    },
    isActive(path) {
      return (location.href.indexOf(path) != -1);
    }
  }
};
</script>
<style lang="scss">
.top-bar {
  height: 70px;
  width: 100%;
  text-align: center;
  position: relative;
  background: #66d0f7;
  z-index: 10;
}
.nav-bar {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;

}
.nav-item {
  color: #fff;
  text-shadow: 1px 1px rgba(255, 255, 255, 0.1);
  font-size: 13pt;
  margin: 0px 50px;
  text-align: center;
  font-weight: 300;
  cursor: pointer;
  position: relative;
  &:hover {
    color: #31a6d1;
  }
  &.active {
    color: #fff;
    border-bottom: solid 2px #fff;
  }
}
.nav-bar img {
  height: 70%;
  transition: all 0.3s ease;
  cursor: pointer;
}
.nav-bar img:hover {
  transform: scale(1.05, 1.05);
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
  color: #4a4a4a;
}
</style>
