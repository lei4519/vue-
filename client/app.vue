<template>
  <div id="app">
    <div id="cover"></div>
    <Header></Header>
    <router-view></router-view>
    <!-- <Notification content="test notify"/> -->
    <!-- <button @click="notify">click me</button> -->
    <Footer></Footer>
  </div>
</template>

<script>
import Header from './layout/header.vue'
import Footer from './layout/footer.vue'
let i = 0
export default {
  metaInfo: {
    title: 'Jokcy\'s Todo App'
  },
  components: {
    Header,
    Footer
  },
  methods: {
    notify() {
      this.$notify({
        content: `test function notify. index: ${i++}`,
        btn: 'close'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
#app {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  #cover {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background-color: #999;
    opacity: 0;
    z-index: -1;
  }
}
</style>
