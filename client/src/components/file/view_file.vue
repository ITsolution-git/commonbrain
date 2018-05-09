<template>
  <div>
      <FileSidebar />
      <div class="projects-container">
          
              <div class="tab-container">
                  <div class="tab active">Item 1</div>
                  <div class="tab">Item 2</div>
              </div>
              <div class="main-data-container">
              <div class="data-container">
                  <div class="data-item">
                      <div class="data-title">Main Data</div>
                  </div>
                <div class="data-elements">
                      <div class="data-item-item">
                        <div class="data-item-title">Data Item Point 1</div>
                        <div class="data-item-value">100,000</div>
                      </div>
                      <div class="data-item-item">
                        <div class="data-item-title">Data Item Point 2</div>
                        <div class="data-item-value">200,000</div>
                      </div>
                       <div class="data-item-item">
                        <div class="data-item-title">Data Item Point 3</div>
                        <div class="data-item-value">300,000</div>
                      </div>
                       <div class="data-item-item">
                        <div class="data-item-title">Data Item Point 4</div>
                        <div class="data-item-value">400,000</div>
                      </div>
                </div>
                 
              </div>
               <div class="data-container">
                  <div class="data-item">
                      <div class="data-title">Main Data</div>
                  </div>
                <div class="data-elements">
                      <div class="data-item-item">
                        <div class="data-item-title">Data Item Point 1</div>
                        <div class="data-item-value">100,000</div>
                      </div>
                      <div class="data-item-item">
                        <div class="data-item-title">Data Item Point 2</div>
                        <div class="data-item-value">200,000</div>
                      </div>
                       <div class="data-item-item">
                        <div class="data-item-title">Data Item Point 3</div>
                        <div class="data-item-value">300,000</div>
                      </div>
                       <div class="data-item-item">
                        <div class="data-item-title">Data Item Point 4</div>
                        <div class="data-item-value">400,000</div>
                      </div>
                </div>
                 
              </div>
              </div>
          
      
      </div>
  </div>
</template>
<script>
import FileSidebar from "./file_sidebar";
export default {
  name: "view file",
  data() {
    return {};
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
  height: 40px;
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
  flex-grow: 1;
  border-bottom: solid 1px #eaeaea;
  margin: 5px;
  background: #fff;
  flex-basis: calc(50% - 10px);
}
.data-item-title {
  padding: 15px;
}
.data-item-value {
  padding: 15px;
  margin-left: auto;
}
.main-data-container {
  display: flex;
  flex-wrap: wrap;
  margin-top: 25px;
}
.data-container {
}
</style>
