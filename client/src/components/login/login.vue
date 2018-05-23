<template>
  <div style="overflow:hidden">
    <LearnMore v-if="learnMore" :hide="toggleLearnMore"/>
    <div class="main-container">
      <div class="web-top-bar">
        <img  src="../../img/brain_white.svg"/>
        <i v-if="mobile" @click="toggleMobileNav" class="fa fa-bars nav-toggle"></i>
        <div class="top-nav" :class="{'mobile':mobile, 'collapsed':!navOpen}">
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Benefits</li>
            <li>Company</li>
            <li><div @click="toggleLearnMore" class="get-started">Get Started</div></li>
          </ul>
        </div>
      </div>
      <div v-if="headerScroll" class="web-top-bar scrolled" :class="{'animated-fast fadeInDown': headerScroll}">
        <img  src="../../img/brain_white.svg"/>
        <i v-if="mobile" @click="toggleMobileNav" class="fa fa-bars nav-toggle"></i>
        <div class="top-nav" :class="{'mobile':mobile, 'collapsed':!navOpen}">
          <ul>
            <li>Home</li>
            <li>About</li>
            <li>Benefits</li>
            <li>Company</li>
            <li><div @click="toggleLearnMore" class="get-started">Get Started</div></li>
          </ul>
        </div>
      </div>
    </div>
    <div id="login-panel" class="login-panel">
      <div class="net"></div>
      <div class="main-splash">
        <div style="flex:1; max-width:600px"><h1>Make Spreadsheets Fun</h1><span>An easy way to collect all your data in one place.</span><br><div @click="toggleLearnMore" class="main-btn">Get Started</div></div>
        <div v-if="$mq == 'lg'" style="flex:1; display:flex;align-items:center;justify-content:center;"><img style="width:200px;" src="../../img/brain.svg" alt=""></div>

      </div>
    </div>
    <div class="wave-container">
      <img src="../../img/wave.svg" alt="">
    </div>
    <div class="section-1">
      <div class="container">
        <div class="row" style="padding-top:25px;">
          <div class="col-sm-12">
            <img style="width:100%;" src="../../img/rait_1_1.png" alt="">
          </div>
          <div class="col-sm-12" style="display:flex;align-items:center; justify-content:center; text-align:center; color:#fff; ">
            <div>
            <h1>Visualize Your Assets</h1>
            <span class="sub-text">CommonBrain makes it very easy to add aspects of your business like operations and financial , and legal compliance data on our dashboard. CommonBrain is totally customizable by you so you can decide what is important to see. While things like Entity Management appears to be ease to handle, with the fast pace of lending and M&A due diligence, simple business tasks become complex and annoying without an easy to edit, change and share your portfolios on the fly.</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    <div class="section-2">
      <div class="container">
        <div class="row" style="padding-top:25px;">
          
          <div class="col-sm-6" style="display:flex;align-items:center; height:400px; justify-content:center; text-align:left; ">
            <div>
            <h1>Quickly Create Webpages for your Excel Documents</h1>
            <span class="sub-text">With the power of CommonBrain, you can whip up fantastic web pages that display the data you want.  You can then share your web pages with colleages or even export and send in an email.</span>
            </div>
          </div>
          <div v-if="$mq != 'sm'" class="col-sm-6" style="display:flex;align-items:center; height:400px; justify-content:center; text-align:center; ">
            <img src="../../img/excel_to_cb.png" style="width:100%;" alt="">
          </div>
          
        </div>
      </div>
    </div>
     <div class="section-3">
      <div class="container">
        <div class="row" style="padding-top:25px;">
          <div  class="col-sm-6" style="display:flex;align-items:center;  justify-content:center; text-align:center; ">
            <img src="../../img/common_square.jpg" style="width:100%; padding-bottom:25px;" alt="">
          </div>
          <div class="col-sm-6" style="display:flex;align-items:center; justify-content:center; text-align:left; ">
            <div>
            <h1>CommonBrain Keeps Everything in One Place</h1>
            <span class="sub-text">CommonBrain keeps, organizes and references all kinds of data, images, pdf, and assets.  You can link dropbox files, attach pdfs, or supply links to other resources quickly and easily. </span>
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
    <div class="footer">
      <div class="container">
        <div class="row" style="padding-top:25px;">
          <div  class="col-sm-6" style="display:flex;align-items:center;  justify-content:center; text-align:center; ">
            <div class="footer-links">
              <div class="footer-link">
                About
              </div>
              <div class="footer-link">
                Company
              </div>
              <div class="footer-link">
                Learn More
              </div>
            </div>
          </div>
          <div class="col-sm-6" style="display:flex;align-items:center; justify-content:center; text-align:left; ">
            <div class="footer-links">
              <div class="footer-link">
                Benefits
              </div>
              <div class="footer-link">
                Jobs
              </div>
              <div class="footer-link">
                Privacy Policy
              </div>
            </div>
          </div>
          
          
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input";
import LearnMore from "./learn_more";
import { mapActions } from "vuex";
export default {
  name: "login",
  data() {
    return {
      hasError: false,
      navOpen: false,
      errorMessage: "",
      mobile: false,
      headerScroll: false,
      learnMore: false
    };
  },

  mounted() {
    window.document.addEventListener("scroll", this.getScrollTop);
    if (this.$mq == "sm") {
      this.mobile = true;
    }
  },
  watch: {
    $mq(val) {
      if (val == "sm") {
        this.mobile = true;
      } else {
        this.mobile = false;
      }
    }
  },
  methods: {
    ...mapActions(["setUser"]),
    toggleLearnMore() {
      this.learnMore = !this.learnMore;
    },
    getScrollTop() {
      var scrollTop = window.window.scrollY;
      var loginPanel = window.document.getElementById("login-panel")
        .clientHeight;
      if (scrollTop > loginPanel - 100) {
        this.headerScroll = true;
      } else {
        this.headerScroll = false;
      }
    },
    toggleMobileNav() {
      this.navOpen = !this.navOpen;
    }
  },
  components: {
    StandardInput,
    LearnMore
  }
};
</script>
<style>
.sub-text {
  font-size: 14pt;
}
.footer-links {
  display: flex;
  flex-direction: column;
  text-align: left;
  width: 100%;
}
.footer-link {
  color: #fff;
  cursor: pointer;
  padding: 15px;
  font-weight: 500;
}
.section-1 {
  background: #3abaeb;
  width: 100%;
  margin-top: -1px;
  padding: 55px 15px;
}
.section-2 {
  background-image: url("../../img/neural_net2.jpg");
  background-size: cover;
  background-position: center;
  padding: 55px 15px;
  width: 100%;
}
.section-3 {
  background: #fff;
  padding: 55px 15px;
  width: 100%;
}
.footer {
  background: #4d585d;
  padding: 55px 15px;
  width: 100%;
}
.top-nav ul {
  height: 100%;
  top: 0;
  position: absolute;
  right: 0;
  padding: 15px;
  display: flex;
  align-items: center;
}
.top-nav ul li {
  padding: 15px;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.top-nav ul li:hover {
  color: #b9ebff;
}
.web-top-bar {
  height: 70px;
  width: 100%;
  display: flex;
  padding: 5px 15px;
  align-items: center;
  color: #3abaeb;
  position: relative;
  z-index: 10;
}
.web-top-bar .top-nav li,
.web-top-bar .top-nav li div {
  color: #3abaeb;
  border-color: #3abaeb;
}
.web-top-bar.scrolled .top-nav li,
.web-top-bar.scrolled .top-nav li div {
  color: #fff;
  border-color: #fff;
}
.web-top-bar.scrolled {
  top: 0;
  position: fixed;
  background: #66d0f7;
  box-shadow: 0px 0px 18px rgba(0, 0, 0, 0.2);
}
.get-started {
  display: flex;
  align-items: center;
  justify-content: center;
  border: solid 2px #ffffff;
  border-radius: 3px;
  height: 40px;
  width: 150px;
  transition: all 0.2s ease;
}
.get-started:hover {
  color: #3abaeb !important;
  background: #fff !important;
  border-color: #fff;
}
.main-splash {
  padding-top: 85px;
  text-align: left;
  position: relative;
  display: flex;
  align-items: center;
  max-width: 1200px;
  width: 100%;
  margin: 0px 50px;
}
.main-splash h1 {
  margin: 0;
  padding: 0;
  font-size: 55pt;
  font-weight: 200;
}
.main-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #3abaeb;
  border: solid 2px #3abaeb;
  border-radius: 3px;
  height: 40px;
  width: 150px;
  transition: all 0.2s ease;
  cursor: pointer;
}
.main-splash span {
  display: inline-block;
  line-height: 25px;
  font-size: 15pt;
  margin-bottom: 25px;
  margin-top: 10px;
}
.main-btn:hover {
  color: #3abaeb;
  background: #fff;
  border-color: #fff;
}
@media (max-width: 728px) {
  .sub-text {
    font-size: 12pt;
  }
  i.nav-toggle {
    padding: 5px;
    font-size: 12pt;
    color: #3abaeb;
    border: solid 1px #3abaeb;
    border-radius: 3px;
    height: 35px;
    width: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
  }
  .web-top-bar.scrolled i.nav-toggle {
    color: #fff;
    border: solid 1px #fff;
  }
  .top-nav ul {
    height: unset;
    background: #3abaeb;
    width: 100%;
    top: 70px;
    box-shadow: 1px 1px 10px -50px rgba(0, 0, 0, 0.2);
    position: absolute;
    right: 0;
    flex-direction: column;
    align-items: center;
    transform: translateX(0);
    opacity: 1;
    transition: transform 0.3s ease;
  }
  .top-nav ul li,
  .top-nav ul li div {
    color: #fff !important;
    border-color: #fff !important;
  }
  .top-nav.collapsed ul {
    transform: translateX(100%);
    opacity: 0;
  }
  .top-nav.mobile ul {
  }
  .main-splash span {
    font-size: 12pt;
  }
  .main-splash {
    text-align: center;
  }
  .main-splash h1 {
    font-size: 24pt;
  }
}
</style>
