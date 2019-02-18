<template>
  <div id="app">
    <div id="cover"></div>
    <Header></Header>
    <router-view></router-view>
    <!-- <Notification content="test notify"/> -->
    <!-- <button @click="notify">click me</button> -->
    <Footer></Footer>
    <div id="loading" v-show="loading">
      <loading/>
    </div>
  </div>
</template>

<script>
import Header from './layout/header.vue'
import Footer from './layout/footer.vue'
import Loading from './components/loading/loading.vue'
import { mapState } from 'vuex'
let i = 0
export default {
  metaInfo: {
    title: 'Jokcy\'s Todo App'
  },
  computed: {
    ...mapState(['loading'])
  },
  components: {
    Header,
    Footer,
    Loading
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
  display: flex;
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
  #loading {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.1);
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
