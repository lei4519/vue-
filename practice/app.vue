<template>
  <div>
    <input type="text" v-model.trim="value">
    <canvas ref="canvas" width="100px" height="50px"></canvas>
    <button>刷新</button>
    <button>submit</button>
  </div>
</template>

<script>
export default {
  data: () => ({
    value: ''
  }),
  methods: {

  },
  mounted() { }
}
</script>

<style lang="scss" scoped>
canvas {
  background-color: #fff;
}
</style>
