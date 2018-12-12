<template>
<div class='standard-input-item' :style="'max-width:'+width">
  <div v-if="(required)">
    <div class="standard-input-title">{{field}}</div>
    <p :class="{ 'control': true }">
      <input  v-validate="'required'" v-model="inputValue"  :class="{'is-danger': errors.has(name) }" :id="id" :type="type" :name="name" class="standard-input" @input="handleInput" :placeholder="placeholder" :style="{'border': '1px solid ' + user.buttonBorder.hex}"/>
      <span v-show="errors.has(name)" class="help is-danger">{{ errors.first(name) }}</span>
    </p>
  </div>

  <div v-if="(required == undefined)">
    <div class="standard-input-title">{{field}}</div>
      <input :autocomplete="name" :id="id"  :type="type" v-model="inputValue"  :name="name" class="standard-input"  @input="handleInput"  :placeholder="placeholder" :style="{'border': '1px solid ' + user.buttonBorder.hex}"/>
  </div>

</div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
export default {
  name: "",
  data: () => ({
    inputValue: this.value
  }),
  mounted() {
    this.inputValue = this.value;
  },
  methods: {
    handleInput (e) {
      this.$emit('input', this.inputValue)
    }
  },
  computed: {
    ...mapGetters({
      user: 'user',
    }),
  },
  props: ["type", "width", "name", "field", "required", "value", "id", "placeholder"],
  inject: ["$validator"]
};
</script>
