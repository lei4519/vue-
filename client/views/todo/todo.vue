<template>
  <section class="real-app">
    <div class="tabs-container">
      <tabs :value="filter" @toggle="toggleFilter">
        <tab :lable="tab" :index="tab" v-for="tab in states" :key="tab"></tab>
      </tabs>
    </div>
    <input
      type="text"
      class="add-input"
      autofocus="autofocus"
      placeholder="接下去要做什么?"
      @keyup.enter="handleAdd"
      v-model="inputContent"
    >
    <div class="todo-container">
      <div class="scroll-view" ref="scrollView">
        <Item :todo="todo"
        v-for="todo in filteredTodos"
        :key="todo.id"
        @del="deleteTodo"
        @toggle="toggleTodoState"/>
      </div>
    </div>
    <helper
      :filter="filter"
      :todos="todos"
      @toggle="toggleFilter"
      @clearAllCompleted="clearAllCompleted"
    />
  </section>
</template>

<script>
import Item from './item.vue'
import Helper from './helper.vue'
let id = 0
let translateY = 0
import { mapState, mapActions } from 'vuex'
export default {
  metaInfo: {
    title: 'The Todo App'
  },
  mounted() {
    this.fetchTodos()
    this.$refs.scrollView.addEventListener('mousewheel', this.todoScroll)
  },
  data() {
    return {
      filter: 'all',
      states: ['all', 'active', 'completed'],
      inputContent: ''
    }
  },
  computed: {
    ...mapState(['todos']),
    filteredTodos() {
      if (this.filter === 'all') {
        return this.todos
      }
      const completed = this.filter === 'completed'
      return this.todos.filter(todo => completed === todo.completed)
    }
  },
  methods: {
    ...mapActions([
      'fetchTodos',
      'addTodo',
      'updateTodo',
      'deleteTodo',
      'deleteAllCompleted'
      ]),
    handleAdd(e) {
      const content = e.target.value.trim()
      if (!content) {
        return this.$notify({
          content: '请输入要做的内容'
        })
      }
      const todo = {
        id: id++,
        content,
        completed: false
      }
      this.addTodo(todo)
      this.inputContent = ''
    },
    toggleTodoState(todo) {
      this.updateTodo({
        id: todo.id,
        todo: Object.assign({}, todo, {
          completed: !todo.completed
        })
      })
    },
    clearAllCompleted() {
      this.deleteAllCompleted()
    },
    toggleFilter(state) {
      this.filter = state
    },
    todoScroll(e) {
      const box = this.$refs.scrollView
      const boxHeight = box.offsetHeight
      // const wrapperHeight = box.parent.offsetHeight
      console.log(box.parent);
      translateY = translateY + e.wheelDeltaY
      translateY = Math.max(-boxHeight, Math.min(0, translateY))
      console.log(translateY);
      box.style.transform = `translateY(${translateY}px)`
    }
  },
  components: {
    Item,
    Helper
  },
}
</script>

<style lang="scss" scoped>
.real-app {
  width: 600px;
  margin: auto;
  box-shadow: 0 0 5px #666;
  background-color: rgba(255, 255, 255, 0.3);
}

.add-input {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: none;
  outline: none;
  color: inherit;
  box-sizing: border-box;
  font-smoothing: antialiased;
  padding: 16px 16px 16px 36px;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
  background-color: transparent;
}
.tabs-container {
  padding: 0 10px;
}
.todo-container{
  max-height: 295px;
  overflow: hidden;
}
</style>


