<template>
  <div>
    <div class="textarea" v-text="text"></div>
    <input type="text" v-model="text">
    <button @click="clear">清空</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    text: ''
  }),
  methods: {
    clear() {
      this.text = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.textarea {
  width: 500px;
  height: 200px;
  background-color: #fff;
}
</style>
