<template>
<div class='standard-input-item' :style="'max-width:'+width">
  <div v-if="(required)">
    <div class="standard-input-title">{{field}}</div>

    <p :class="{ 'control': true }">
      <input :autocomplete="name" data-vv-validate-on="none" v-validate="'required'" :class="{'input': true, 'is-danger': errors.has(name) }" :id="id" :type="type" :value="value" :name="name" class="standard-input" />
      <span v-show="errors.has(name)" class="help is-danger">{{ errors.first(name) }}</span>
    </p>
  </div>

  <div v-if="(required == undefined)">
    <div class="standard-input-title">{{field}}</div>
      <input :autocomplete="name" :id="id"  :type="type" :name="name" :value="value" class="standard-input" />
  </div>

</div>
</template>
<script>
export default {
  name: "",
  data: () => ({}),
  props: ["type", "width", "name", "field", "required", "value", "id"],
  inject: ["$validator"]
};
</script>
