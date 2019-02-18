<script>
import TabContainer from './tab-container.vue'
export default {
  name: 'Tabs',
  provide() {
    return {
      Tab: this
    }
  },
  props: {
    value: {
      type: [String, Number]
    }
  },
  data() {
    return {
      index: 0,
      panes: [],
      currentIndex: this.value ? this.value : this.index
    }
  },
  methods: {
    changeIndex(index) {
      this.currentIndex = index
      this.$emit('toggle', index)
    }
  },
  components: {
    TabContainer
  },
  render() {
    return (
      <div class="tabs">
        <ul class="tabs-header">
          {this.$slots.default}
        </ul>
        <tab-container panes={this.panes}></tab-container>
      </div>
    )
  }
}
</script>

<style lang="scss" scoped>
.tabs-header {
  display: flex;
  margin: 0;
  padding: 0;
  border-bottom: 2px solid transparent;
}
</style>