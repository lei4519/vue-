<template>
  <transition name="fade" @after-leave="afterLeave" @after-enter="afterEnter">
    <div
      class="notification"
      :style="style"
      v-show="visiable"
      @mouseenter="clearTimer"
      @mouseleave="createTimer"
    >
      <span class="content">{{ content }}</span>
      <a class="btn" @click="handleClose">{{ btn }}</a>
    </div>
  </transition>
</template>

<script>
export default {
  name: "Notification",
  props: {
    content: {
      type: String,
      required: true
    },
    btn: {
      type: String,
      default: '关闭'
    }
  },
  data: () => ({
    visiable: true
  }),
  computed: {
    style() {
      return {}
    }
  },
  methods: {
    handleClose(e) {
      e.preventDefault()
      this.$emit('close')
    },
    afterEnter() {
      // 子类中实现
    },
    afterLeave() {
      this.$emit('closed')
    },
    createTimer() {
      // 子类中实现
    },
    clearTimer() {
      // 子类中实现
    }
  }
}
</script>

<style lang="scss" scoped>
.notification {
  position: fixed;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  padding: 20px;
  min-width: 280px;
  background-color: #303030;
  color: rgba(255, 255, 255, 1);
  box-shadow: 0 3px 5px -1px rgba(#000, 0.2), 0 6px 10px 0 rgba(#000, 0.14),
    0 1px 18px 0 rgba(#000, 0.12);
  transition: all 0.3s;
  .content {
    padding: 0;
  }
  .btn {
    color: #ff4081;
    padding-left: 24px;
    margin-left: auto;
    cursor: pointer;
  }
}
</style>