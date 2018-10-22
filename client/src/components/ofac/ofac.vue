<template>
    <div>
        <div class="no-sidebar-container">
            <div class="main-title">Search OFAC</div>
        </div>
        <div class="ofac-content">
          <StandardInput
            field="Email To"
            v-model="emailTos"
            width="100%"
            placeholder="john@lz.com,denny@gmail.com"
          />

          <StandardInput
            field="Search Keys"
            v-model="searchKeys"
            placeholder="japan,russia"
            width="100%"
          />

          <button @click="search()" class="modal-btn btn-white" type="submit">
            Request Search
          </button>
        </div>
    </div>
</template>
<script>
import StandardInput from "../form_elements/standard_input";
import ApiWrapper from '@/shared/utils/ApiWrapper';

export default {
  name: "ofac",
  data() {
    return {
      emailTos: '',
      searchKeys: '',
    };
  },
  components: {
    StandardInput
  },
  mouted() {},
  methods: {
    search() {
      if (!this.emailTos || !this.searchKeys)
        return;
      let searches = this.searchKeys.split(',').map(item=>{
        return {name:item};
      });
      ApiWrapper
        .post(
          "/api/ofac/scrap",  
          {searches: searches, emails:this.emailTos.split(',')}
        )
        .then(res => {
          alert('Email sent to ' + this.emailTos);
        });

    }
  },
  computed: {}
};
</script>
<style>
.ofac-content {
  margin: 20px;
}
</style>
