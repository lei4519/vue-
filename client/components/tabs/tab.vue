<template>
  <li class="tab" :class="{'active': active}" @click="changeIndex">
    <slot name="lable"></slot>
    <span v-if="!$slots.lable">{{ this.lable }}</span>
  </li>
</template>

<script>
let index = 0
export default {
  name: 'Tab',
  inject: ['Tab'],
  props: {
    index: {
      type: [String, Number]
    },
    lable: {
      type: String,
      defaule: 'tab'
    }
  },
  data() {
    return {
      i: index++
    }
  },
  computed: {
    idx() {
      return this.index ? this.index : this.i
    },
    active() {
      return this.Tab.currentIndex === this.idx

    }
  },
  methods: {
    changeIndex() {
      this.Tab.changeIndex(this.idx)
    }
  },
  mounted() {
    this.Tab.panes.push(this)
  }
}
</script>

<style lang="scss" scoped>
.tab {
  list-style: none;
  line-height: 40px;
  margin-right: 30px;
  position: relative;
  bottom: -2px;
  cursor: pointer;
  &.active {
    border-bottom: 2px solid blue;
  }
  &:last-child {
    margin-right: 0;
  }
}
</style>